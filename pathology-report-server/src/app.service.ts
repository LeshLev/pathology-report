import { Injectable } from '@nestjs/common';

import { PrismaService } from './prisma.service';
import { ReportService } from './report/report.service';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reportService: ReportService,
  ) {}

  getHello(): string {
    return 'Please upload file using POST request!';
  }

  async interpretReport(report: Express.Multer.File) {
    const reportItems = this.reportService.parseRawReport(
      report.buffer.toString('utf8'),
    );
    const abnormalResults: {
      id: number;
      diagnosticMetric: string;
      observation: string;
      condition: string;
      units: string;
      value: number;
      standardHigh: number | null;
      standardLow: number | null;
      everlabHigh: number | null;
      everlabLow: number | null;
      diagnostic: string;
      diagnosticGroups: string;
    }[] = [];

    const { patient, observations } =
      this.reportService.getPatientObservations(reportItems);
    const observationValues = observations.filter(({ value }) => !!value);

    const diagnosticMetrics = await this.prisma.diagnosticMetric.findMany({
      where: {
        OR: observationValues.map(({ sonicCode, sonicUnit }) => ({
          oru_sonic_codes: { contains: sonicCode },
          oru_sonic_units: { contains: sonicUnit },
        })),
        conditionId: { not: null },
      },
      include: {
        Condition: true,
        diagnosticGroups: true,
        Diagnostic: true,
      },
    });

    // Find abnormal metrics
    diagnosticMetrics.forEach((dMetric) => {
      const {
        standard_higher,
        standard_lower,
        everlab_higher,
        everlab_lower,
        gender,
        min_age,
        max_age,
      } = dMetric;

      if (
        standard_higher === null &&
        standard_lower === null &&
        everlab_higher === null &&
        everlab_lower === null
      ) {
        return;
      }

      const observationValue = observationValues.find(({ sonicCode }) =>
        dMetric.oru_sonic_codes.split(';').includes(sonicCode),
      );
      if (!observationValue || observationValue.value === null) return;

      const genderFilter = gender === 'Any' || gender === patient.sex;
      const minAgeFilter = min_age === null || patient.age > min_age;
      const maxAgeFilter = max_age === null || patient.age < max_age;

      let valueFilter = false;
      for (const higherValue of [standard_higher, everlab_higher]) {
        if (higherValue === null) continue;

        valueFilter = observationValue.value > higherValue;
      }
      if (!valueFilter) {
        for (const lowerValue of [standard_lower, everlab_lower]) {
          if (lowerValue === null) continue;

          valueFilter = observationValue.value < lowerValue;
        }
      }

      if (valueFilter && genderFilter && minAgeFilter && maxAgeFilter) {
        abnormalResults.push({
          id: dMetric.id,
          diagnosticMetric: dMetric.name,
          observation: observationValue.observationRequest,
          condition: dMetric.Condition?.name || '',
          units: dMetric.oru_sonic_units || dMetric.units,
          value: observationValue.value,
          everlabHigh: everlab_higher,
          everlabLow: everlab_lower,
          standardHigh: standard_higher,
          standardLow: standard_lower,
          diagnostic: dMetric.Diagnostic?.name || '',
          diagnosticGroups: dMetric.diagnosticGroups
            .map(({ name }) => name)
            .join(', '),
        });
      }
    });

    return { patient, abnormalResults };
  }
}

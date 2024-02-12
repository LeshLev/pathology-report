import { DefinitionBuilder, Element, Hl7Parser } from '@manhydra/hl7-parser';
import { BadRequestException, Injectable } from '@nestjs/common';

import { ObservationDto, PatientDto } from './dto';
import { getAge, getGender } from './helpers';

@Injectable()
export class ReportService {
  getPatientObservations(reportItems: Element[]): {
    patient: PatientDto;
    observations: ObservationDto[];
  } {
    const patient: PatientDto = { age: 0, id: '', name: '', sex: 'Any' };
    const observations: ObservationDto[] = [];

    let currRequest = '';
    let currObservation = 0;
    // Extract useful data from the report item
    for (const { name, value, children } of reportItems) {
      switch (name) {
        // Patient info
        // Should be the same across the report
        case 'PID-1':
          patient.id = value;
          break;
        case 'PID-5':
          patient.name =
            `${children[0].value || ''} ${children[1].value || ''}`.trim();
          break;
        case 'PID-7':
          patient.age = getAge(value);
          break;
        case 'PID-8':
          patient.sex = getGender(value);
          break;
        // Observation request
        case 'OBR-4':
          currRequest = children[1].value;
          break;
        // Observations
        case 'OBX-1':
          observations[currObservation] = {
            ...observations[currObservation],
            observationRequest: currRequest,
            id: value,
          };
          break;
        case 'OBX-3':
          observations[currObservation] = {
            ...observations[currObservation],
            sonicCode: children[1].value,
          };
          break;
        case 'OBX-5':
          observations[currObservation] = {
            ...observations[currObservation],
            value: !isNaN(parseFloat(value)) ? parseFloat(value) : null,
          };
          break;
        case 'OBX-6':
          if (!!value) {
            observations[currObservation] = {
              ...observations[currObservation],
              sonicUnit: children[0].value,
            };
          }
          currObservation += 1;
          break;

        default:
          break;
      }
    }

    return { patient, observations };
  }

  parseRawReport(reportRaw: string) {
    const hl7Message = new Hl7Parser().getHl7Model(
      reportRaw.replaceAll('\r', '\n'),
    );
    hl7Message.children = hl7Message.children.filter((element) => !!element);

    if (!hl7Message.children.length) {
      console.timeEnd('parseRawReport');
      throw new BadRequestException();
    }

    new DefinitionBuilder().addDefinitionToHl7Message(hl7Message);

    return hl7Message.children.flatMap(({ children }) => children);
  }
}

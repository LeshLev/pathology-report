import * as fs from 'fs';

import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse';

// Initialize Prisma Client
const prisma = new PrismaClient();

const CSV_FILES = {
  conditions: './data/csv/conditions.csv',
  diagnostic_groups: './data/csv/diagnostic_groups.csv',
  diagnostic_metrics: './data/csv/diagnostic_metrics.csv',
  diagnostics: './data/csv/diagnostics.csv',
};

async function importData() {
  try {
    // Import diagnostic metrics
    const diagnosticMetricsData = await parseCSV<{
      name: string;
      oru_sonic_codes: string;
      oru_sonic_units: string;
      diagnostic: string;
      diagnostic_groups: string;
      units: string;
      min_age: number;
      max_age: number;
      gender: string;
      standard_lower: number;
      standard_higher: number;
      everlab_lower: number;
      everlab_higher: number;
    }>(CSV_FILES['diagnostic_metrics']);
    for (let i = 0; i < diagnosticMetricsData.length; i++) {
      const diagnosticMetric = diagnosticMetricsData[i];
      const newDiagnosticMetric = await prisma.diagnosticMetric.create({
        data: {
          name: diagnosticMetric.name,
          oru_sonic_codes: diagnosticMetric.oru_sonic_codes,
          oru_sonic_units: diagnosticMetric.oru_sonic_units,
          units: diagnosticMetric.units,
          min_age: getNumberValue(diagnosticMetric.min_age),
          max_age: getNumberValue(diagnosticMetric.max_age),
          gender: diagnosticMetric.gender,
          standard_lower: getNumberValue(diagnosticMetric.standard_lower),
          standard_higher: getNumberValue(diagnosticMetric.standard_higher),
          everlab_lower: getNumberValue(diagnosticMetric.everlab_lower),
          everlab_higher: getNumberValue(diagnosticMetric.everlab_higher),
        },
      });
      console.log(
        `${i + 1}. Diagnostic Metric '${newDiagnosticMetric.name}' imported successfully.`,
      );
    }

    // Import conditions
    const conditionsData = await parseCSV<{
      name: string;
      diagnostic_metrics: string;
    }>(CSV_FILES['conditions']);
    for (let i = 0; i < conditionsData.length; i++) {
      const condition = conditionsData[i];
      const newCondition = await prisma.condition.create({
        data: {
          name: condition.name,
          diagnosticMetrics: {
            connect: splitStringIgnoringQuotes(
              condition.diagnostic_metrics,
            ).map((diagnosticMetric) => ({ name: diagnosticMetric })),
          },
        },
      });
      console.log(
        `${i + 1}. Condition '${newCondition.name}' imported successfully.`,
      );
    }

    // Import diagnostic groups
    const diagnosticGroupsData = await parseCSV<{
      name: string;
      diagnostics: string;
      diagnostic_metrics: string;
    }>(CSV_FILES['diagnostic_groups']);
    for (let i = 0; i < diagnosticGroupsData.length; i++) {
      const diagnosticGroup = diagnosticGroupsData[i];
      const newDiagnosticGroup = await prisma.diagnosticGroup.create({
        data: {
          name: diagnosticGroup.name,
          diagnosticMetrics: {
            connect: splitStringIgnoringQuotes(
              diagnosticGroup.diagnostic_metrics,
            ).map((diagnosticMetric) => ({ name: diagnosticMetric })),
          },
        },
      });
      console.log(
        `${i}. Diagnostic Group '${newDiagnosticGroup.name}' imported successfully.`,
      );
    }

    // Import diagnostics
    const diagnosticsData = await parseCSV<{
      name: string;
      diagnostic_groups: string;
      diagnostic_metrics: string;
    }>(CSV_FILES['diagnostics']);
    for (let i = 0; i < diagnosticsData.length; i++) {
      const diagnostic = diagnosticsData[i];
      const newDiagnostic = await prisma.diagnostic.create({
        data: {
          name: diagnostic.name,
          diagnosticGroups: {
            connect: splitStringIgnoringQuotes(
              diagnostic.diagnostic_groups,
            ).map((diagnosticGroup) => ({ name: diagnosticGroup })),
          },
          diagnosticMetrics: {
            connect: splitStringIgnoringQuotes(
              diagnostic.diagnostic_metrics,
            ).map((diagnosticMetric) => ({ name: diagnosticMetric })),
          },
        },
      });

      console.log(
        `${i + 1}. Diagnostic '${newDiagnostic.name}' imported successfully.`,
      );
    }
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

function getNumberValue(input: number): number | null {
  if (input === 0 || !!input) return input;
  return null;
}

function splitStringIgnoringQuotes(input: string): string[] {
  return (input.match(/(?:[^",]+|"[^"]*")+/g) || []).map((val) =>
    val.replaceAll('"', ''),
  );
}

function parseCSV<T>(filePath: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const rows: T[] = [];

    fs.createReadStream(filePath)
      .pipe(parse({ delimiter: ',', columns: true, cast: true, bom: true }))
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', () => {
        resolve(rows);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

importData();

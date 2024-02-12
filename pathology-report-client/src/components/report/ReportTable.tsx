import { Table, Text } from '@mantine/core';
import { ReportResult } from '../../types';
import { FC } from 'react';

type Props = {
  results: ReportResult[];
};

export const ReportTable: FC<Props> = ({ results }) => {
  if (!results.length) {
    return <Text size={'lg'}>No abnormal test values found</Text>;
  }

  return (
    <Table.ScrollContainer minWidth={335}>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Observation</Table.Th>
            <Table.Th>Diag. metric</Table.Th>
            <Table.Th>Diag. groups</Table.Th>
            <Table.Th>Diagnostic</Table.Th>
            <Table.Th>Condition</Table.Th>
            <Table.Th>Value</Table.Th>
            <Table.Th>Std. high/low</Table.Th>
            <Table.Th>Everlab high/low</Table.Th>
            <Table.Th>Units</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {results.map((result) => (
            <Table.Tr key={result.id}>
              <Table.Td>{result.observation}</Table.Td>
              <Table.Td>{result.diagnosticMetric}</Table.Td>
              <Table.Td>{result.diagnosticGroups}</Table.Td>
              <Table.Td>{result.diagnostic}</Table.Td>
              <Table.Td>{result.condition}</Table.Td>
              <Table.Td>{result.value}</Table.Td>
              <Table.Td>
                {getRangeValue(result.standardHigh, result.standardLow)}
              </Table.Td>
              <Table.Td>
                {getRangeValue(result.everlabHigh, result.everlabLow)}
              </Table.Td>
              <Table.Td>{result.units}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};

const getRangeValue = (high: number | null, low: number | null) => {
  return `${high === null ? '-' : high}/${low === null ? '-' : low}`;
};

export default ReportTable;

import { FC } from 'react';
import { Patient } from '../types';
import { Card, Text } from '@mantine/core';

type Props = {
  patient: Patient;
};

export const PatientInfo: FC<Props> = ({ patient }) => {
  return (
    <Card shadow="xs" padding="md">
      <Text size="lg" style={{ marginBottom: 10 }}>
        Patient Information - {patient.name}
      </Text>
      <div style={{ marginBottom: 20 }}>
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          <li>
            <Text size="sm">Age: {patient.age}</Text>
          </li>
          <li>
            <Text size="sm">Sex: {patient.sex}</Text>
          </li>
        </ul>
      </div>
    </Card>
  );
};

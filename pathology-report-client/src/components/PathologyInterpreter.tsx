import { Container, Flex, Text, Title } from '@mantine/core';
import { ReportTable, ReportUpload } from './report';
import { PatientInfo } from './PatientInfo';
import { useUploadReport } from '../hooks';

export const PathologyInterpreter = () => {
  const { data, error, isPending, mutate } = useUploadReport();

  return (
    <Container fluid h={'100vh'} px={'md'} py={'lg'}>
      <Flex direction={'column'} gap={'md'}>
        <Title order={1}>Pathology Interpreter</Title>
        <ReportUpload
          loading={isPending}
          onUploaded={(file) => {
            mutate(file);
          }}
        />
        {!!error && (
          <Text size={'lg'} c={'red.8'}>
            {error.response?.status} -{' '}
            {error.response?.statusText || error.message}
          </Text>
        )}
        {data?.patient && <PatientInfo patient={data.patient} />}
        {!!data?.abnormalResults && (
          <ReportTable results={data.abnormalResults} />
        )}
      </Flex>
    </Container>
  );
};

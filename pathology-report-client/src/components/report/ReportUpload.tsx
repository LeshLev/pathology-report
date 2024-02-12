import { Group, Text, rem } from '@mantine/core';
import { IconFileUpload, IconFile, IconX } from '@tabler/icons-react';
import { Dropzone, DropzoneProps, FileWithPath } from '@mantine/dropzone';
import { FC } from 'react';

type Props = {
  onUploaded: (file: FileWithPath) => void;
} & Partial<DropzoneProps>;

export const ReportUpload: FC<Props> = ({ onUploaded, ...props }) => {
  return (
    <Dropzone
      onDrop={(files) => onUploaded(files[0])}
      maxSize={5 * 1024 ** 2}
      accept={['text/plain']}
      multiple={false}
      {...props}
    >
      <Group
        justify="center"
        gap="xl"
        mih={150}
        style={{ pointerEvents: 'none' }}
      >
        <Dropzone.Accept>
          <IconFileUpload
            style={{
              width: rem(52),
              height: rem(52),
              color: 'var(--mantine-color-blue-6)',
            }}
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            style={{
              width: rem(52),
              height: rem(52),
              color: 'var(--mantine-color-red-6)',
            }}
            stroke={1.5}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconFile
            style={{
              width: rem(52),
              height: rem(52),
              color: 'var(--mantine-color-dimmed)',
            }}
            stroke={1.5}
          />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            Drag a file here or click to select one
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            Select only one file, it should not exceed 5mb
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
};

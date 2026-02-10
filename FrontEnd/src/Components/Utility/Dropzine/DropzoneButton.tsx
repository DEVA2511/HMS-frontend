import { useRef, useState } from "react";
import {
  IconCloudUpload,
  IconDownload,
  IconX,
  IconPhoto,
} from "@tabler/icons-react";
import { Button, Group, Text, useMantineTheme } from "@mantine/core";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import classes from "./DropzoneButton.module.css";
import { uploadMedia } from "../../../Service/MediaService";

interface DropzoneButtonProps {
  onUpload: (data: any) => void;
  form: any;
  id: string;
}

export function DropzoneButton({ onUpload, form, id }: DropzoneButtonProps) {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleDrop = async (files: FileWithPath[]) => {
    if (files.length === 0) return;

    const fileData = files[0];
    setFile(fileData); // Restore preview

    uploadMedia(fileData)
      .then((data: any) => {
        onUpload(data);
        form.setFieldValue(id, data.id);
      })
      .catch((error: any) => {
        console.error("Upload failed:", error);
      });
  };

  return (
    <div className={classes.wrapper}>
      <Dropzone
        openRef={openRef}
        onDrop={handleDrop}
        className={classes.dropzone}
        radius="md"
        accept={IMAGE_MIME_TYPE}
        maxSize={5 * 1024 ** 2}
        aria-label="Drop images here"
      >
        <div style={{ pointerEvents: "none" }}>
          {file ? (
            <Group justify="center">
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className={classes.imagePreview}
              />
            </Group>
          ) : (
            <Group justify="center">
              <Dropzone.Accept>
                <IconDownload
                  size={50}
                  color={theme.colors.blue[6]}
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX size={50} color={theme.colors.red[6]} stroke={1.5} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto size={50} stroke={1.5} className={classes.icon} />
              </Dropzone.Idle>
            </Group>
          )}

          <Text ta="center" fw={700} fz="lg" mt="xl">
            <Dropzone.Accept>Drop image here</Dropzone.Accept>
            <Dropzone.Reject>Image file less than 5mb</Dropzone.Reject>
            <Dropzone.Idle>
              {file ? "Selected Image" : "Upload profile picture"}
            </Dropzone.Idle>
          </Text>

          <Text className={classes.description}>
            {file
              ? "Image ready for upload. You can still drag'n'drop to change."
              : "Drag'n'drop your profile picture here. We accept .png, .jpeg files less than 5mb."}
          </Text>
        </div>
      </Dropzone>

      <Button
        type="button"
        className={classes.control}
        size="md"
        radius="xl"
        onClick={() => openRef.current?.()}
      >
        {file ? "Change image" : "Select image"}
      </Button>
    </div>
  );
}

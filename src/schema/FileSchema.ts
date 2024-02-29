import { z } from 'zod'

// Schema for file payload validation
export const FileSchema = z.object(
  {
    fieldname: z.string({ required_error: 'file fieldname is missing' }),
    originalname: z.string({ required_error: 'file originalname is missing' }),
    encoding: z.string({ required_error: 'file encoding is missing' }),
    mimetype: z.string({ required_error: 'file mimetype is missing' }),
    buffer: z.any({ required_error: 'file buffer is missing' }),
    size: z.number({ required_error: 'file size is missing' }),
  },
  { required_error: 'file is missing in payload' },
)

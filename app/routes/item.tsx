import type { Route } from './+types/item';
import { db, itemTable } from '~/db';
import { eq, sql } from 'drizzle-orm';
import { redirect, useLoaderData } from 'react-router';
import { sessionStorage } from '~/auth.server';
import { ItemDetail } from '~/components/item-detail';
import { type FileUpload, parseFormData } from '@mjackson/form-data-parser';
import { z } from 'zod';
import { beautifyZodError } from '~/lib/utils';
import sharp from 'sharp';
import { resolve } from 'path';
import { randomUUID } from 'crypto';
import { unlinkSync } from 'fs';

const itemSchema = z.object({
  uuid: z.union([z.string().uuid(), z.literal('new')]),
  name: z.string().min(1, '1글자 이상 입력해주세요.').max(30, '30글자 이하로 입력해주세요.'),
  location: z.string().min(1, '1글자 이상 입력해주세요.').max(50, '50글자 이하로 입력해주세요.'),
  createdAt: z
    .string()
    .datetime()
    .transform((v) => new Date(v)),
  processedAt: z
    .string()
    .datetime()
    .transform((v) => new Date(v)),
  reporter: z.string().min(1, '1글자 이상 입력해주세요.').max(30, '30글자 이하로 입력해주세요.'),
  receiver: z
    .string()
    .refine((v) => !(v && v.length > 0 && v.length < 2), {
      message: '1글자 이상 입력해주세요.',
    })
    .refine((v) => !(v && v.length > 0 && v.length > 30), {
      message: '30글자 이하로 입력해주세요.',
    }),
  status: z.union([
    z.literal('PENDING'),
    z.literal('RETURNED'),
    z.literal('DISCARDED'),
    z.literal('DELETED'),
  ]),
});

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: data.displayName ? `LFNMS - ${data.displayName}` : 'LFNMS' },
    { name: 'description', content: '능주고 분실물 관리 시스템' },
  ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(request.headers.get('cookie'));
  const user = session.get('user');
  if (!user) return redirect('/login');

  const { id } = params;
  if (!id || typeof id !== 'string') return redirect('/item/new');

  const item = await db.select().from(itemTable).where(eq(itemTable.uuid, id.toString())).get();
  if (!item && id !== 'new') return redirect('/LNFMS');
  const displayName = id == 'new' ? 'NEW' : item?.name;

  return { item, id, displayName };
}

export async function action({ request }: Route.ActionArgs) {
  try {
    let image: ArrayBuffer | string | undefined;
    let imagePath: string | undefined;

    const formData = await parseFormData(
      request,
      {
        maxFileSize: 1024 * 1024 * 10,
      },
      async (fileUpload: FileUpload) => {
        if (fileUpload.fieldName === 'image' && fileUpload.type.startsWith('image/')) {
          image = await fileUpload.arrayBuffer();
          return;
        }
      },
    );

    const item = itemSchema.parse(Object.fromEntries(formData.entries()));

    if (image && image instanceof ArrayBuffer && image.byteLength > 0) {
      imagePath = randomUUID() + '.webp';
      await sharp(image)
        .webp()
        .toFile(resolve(import.meta.env.STATIC_FILE_PATH!, imagePath));
    }

    if (item.uuid === 'new') {
      if (!imagePath) {
        return {
          errors: {
            image: '이미지를 업로드해주세요.',
          },
        };
      }

      await db.insert(itemTable).values({
        name: item.name,
        location: item.location,
        createdAt: item.createdAt,
        processedAt: item.processedAt,
        reporter: item.reporter,
        receiver: item.receiver,
        status: item.status,
        image: `/static/${imagePath}`,
      });
    } else {
      if (imagePath) {
        const prevImage = await db
          .select({ image: itemTable.image })
          .from(itemTable)
          .where(eq(itemTable.uuid, item.uuid))
          .get();

        if (prevImage?.image)
          unlinkSync(
            resolve(import.meta.env.STATIC_FILE_PATH!, prevImage.image.replace('/static/', '')),
          );
      }

      await db
        .update(itemTable)
        .set({
          name: item.name,
          location: item.location,
          createdAt: item.createdAt,
          processedAt: item.processedAt,
          reporter: item.reporter,
          receiver: item.receiver,
          status: item.status,
          image: imagePath ? `/static/${imagePath}` : sql`${itemTable.image}`,
        })
        .where(eq(itemTable.uuid, item.uuid));
    }
  } catch (error) {
    const err = error as Error;
    if (err.name === 'MaxFileSizeExceededError') {
      return {
        errors: {
          image: '10MB 이하의 이미지만 업로드 가능합니다.',
        },
      };
    }
    if (err instanceof z.ZodError) {
      return {
        errors: beautifyZodError(err),
      };
    }
  }

  return redirect('/LNFMS');
}

export default function ItemPage() {
  const { item, id } = useLoaderData<typeof loader>();

  return <ItemDetail item={item} id={id} />;
}

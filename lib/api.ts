import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api/notes";
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN as string;
const PER_PAGE = 12;

interface fetchNotesProps {
  page: number;
  searchValue: string;
  tag?: string;
}

interface fetchNotesResponse {
  notes: Note[];
  totalPages: number;
  tag: string | undefined;
}

export async function fetchNotes({ page, searchValue, tag }: fetchNotesProps) {
  const t = tag?.trim();
  const isAll = t?.toLowerCase() === "all";

  const { data } = await axios.get<fetchNotesResponse>(`${BASE_URL}`, {
    params: {
      page,
      perPage: PER_PAGE,
      search: searchValue,
      ...(t && !isAll ? { tag: t } : {}), // через спред якщо тег обрано, то по ньому отримання, якщо ні, то всі нотатки
    },
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });
  return data;
}

//! test
// interface fetchTestProps {
//   tag?: string;
// }

// interface fetchTestResponse {
//   notes: Note[];
//   totalPages: number;
// }

// export async function fetchTest(params?: fetchTestProps) {
//   const { data } = await axios.get<fetchTestResponse>(`${BASE_URL}`, {
//     params: {
//       perPage: PER_PAGE,
//       tag: params?.tag,
//     },
//     headers: {
//       Authorization: `Bearer ${ACCESS_TOKEN}`,
//     },
//   });
//   return data;
// }
//! test

//! Запит за id
export async function fetchNoteById(id: string) {
  const { data } = await axios.get<Note>(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });
  return data;
}
//! Запит за id

interface createNoteProps {
  title: string;
  content?: string;
  tag: NoteTag;
}

export async function createNote(data: createNoteProps) {
  const res = await axios.post<Note>(`${BASE_URL}`, data, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });
  return res.data;
}

export async function deleteNote(noteId: string) {
  const res = await axios.delete<Note>(`${BASE_URL}/${noteId}`, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });
  return res.data;
}

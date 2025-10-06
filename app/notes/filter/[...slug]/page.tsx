//!
import css from "./NotesPage.module.css";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface NotesProps {
  searchParams: Promise<{ query?: string; page?: string }>;
  params: Promise<{ slug?: string[] }>;
}

async function Notes({ searchParams, params }: NotesProps) {
  const data = await searchParams;

  const search = data.query ?? "";
  const page = Math.max(Number(data.page) || 1, 1);

  const { slug } = await params; //  дістаємо з url параметр
  const tagReceived: string | undefined = slug?.[0];
  const tag = tagReceived !== "all" ? tagReceived : undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", page, search, tag],
    queryFn: () => fetchNotes({ page, searchValue: search, tag }),
  });

  return (
    <div className={css.app}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient
          initialPage={page}
          initialSearch={search}
          initialTag={tag ?? "all"}
        />
      </HydrationBoundary>
    </div>
  );
}

export default Notes;

//? Шоста домашка
// import { fetchNotes } from "@/lib/api";
// import css from "./NotesPage.module.css";
// import NotesClient from "./Notes.client";
// import {
//   dehydrate,
//   HydrationBoundary,
//   QueryClient,
// } from "@tanstack/react-query";

// interface NotesProps {
//   searchParams: Promise<{
//     query?: string;
//     page?: string;
//   }>;
// }

// async function Notes({ searchParams }: NotesProps) {
//   const intermediate = await searchParams;

//   const search = intermediate.query ?? "";
//   const page = Math.max(Number(intermediate.page) || 1, 1);

//   const queryClient = new QueryClient();

//   await queryClient.prefetchQuery({
//     queryKey: ["note", page, search],
//     queryFn: () => fetchNotes({ page, searchValue: search }),
//   });

//   return (
//     <div className={css.app}>
//       <HydrationBoundary state={dehydrate(queryClient)}>
//         <NotesClient initialPage={page} initialSearch={search} />
//       </HydrationBoundary>
//     </div>
//   );
// }

// export default Notes;

//! Отак працює за тегом
// import { fetchTest } from "@/lib/api";
// import NotesClient from "./Notes.client";

// interface NotesProps {
//   params: Promise<{ slug: string[] }>;
//   query?: string;
//   page?: string;
// }

// async function Notes({ params }: NotesProps) {
//   const { slug } = await params;
//   const tag = slug[0];

//   const requestParams = {
//     tag: tag === "all" ? undefined : { tag },
//   };
//   const notes = await fetchTest(requestParams.tag);
//   console.log(tag, notes);

//   return (
//     <div>{notes?.notes?.length > 0 && <NotesClient notes={notes.notes} />}</div>
//   );
// }

// export default Notes;

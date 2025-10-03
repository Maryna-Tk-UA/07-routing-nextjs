//! SSR-component
import { fetchNotes } from "@/lib/api";
import css from "./NotesPage.module.css";
import NotesClient from "./Notes.client";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface NotesProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}

async function Notes({ searchParams }: NotesProps) {
  const intermediate = await searchParams;

  const search = intermediate.query ?? "";
  const page = Math.max(Number(intermediate.page) || 1, 1);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", page, search],
    queryFn: () => fetchNotes({ page, searchValue: search }),
  });

  return (
    <div className={css.app}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient initialPage={page} initialSearch={search} />
      </HydrationBoundary>
    </div>
  );
}

export default Notes;

//! Внизу оригінал

// import css from "./NotesPage.module.css";
// import { keepPreviousData, useQuery } from "@tanstack/react-query";
// import { useState } from "react";
// import { Toaster } from "react-hot-toast";
// import { useDebouncedCallback } from "use-debounce";
// import { fetchNotes } from "@/lib/api";
// import Modal from "@/components/Modal/Modal";
// import NoteForm from "@/components/NoteForm/NoteForm";
// import NoteList from "@/components/NoteList/NoteList";
// import Pagination from "@/components/Pagination/Pagination";
// import SearchBox from "@/components/SearchBox/SearchBox";

// function Notes() {
//   const [curPage, setCurPage] = useState(1);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchValue, setSearchValue] = useState("");

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   const { data, isLoading, isError, isSuccess } = useQuery({
//     queryKey: ["notes", curPage, searchValue],
//     queryFn: () => fetchNotes({ page: curPage, searchValue }), //це я передаю на бекенд запит. якщо натисну 3,то selected=2, отже curPage=2 і у запит пішло page = curPage + 1 = 3
//     placeholderData: keepPreviousData,
//   });

//   const handleSearch = useDebouncedCallback((value: string) => {
//     setSearchValue(value);
//     setCurPage(1);
//   }, 500);

//   return (
//     <div className={css.app}>
//       <Toaster />
//       <header className={css.toolbar}>
//         <SearchBox onSearch={handleSearch} value={searchValue} />
//         {isSuccess && data.totalPages > 1 && (
//           <Pagination
//             totalPages={data.totalPages}
//             curPage={curPage}
//             onChange={setCurPage}
//           />
//         )}
//         <button className={css.button} onClick={openModal}>
//           Create note +
//         </button>
//       </header>
//       {isLoading && <p>Loading notes...</p>}
//       {isError && <p>Something went wrong...</p>}
//       {data && <NoteList notes={data.notes} />}
//       {isModalOpen && (
//         <Modal onClose={closeModal}>
//           <NoteForm onClose={closeModal} />
//         </Modal>
//       )}
//     </div>
//   );
// }

// export default Notes;

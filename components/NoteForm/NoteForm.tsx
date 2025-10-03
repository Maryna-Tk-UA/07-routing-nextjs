import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import css from "./NoteForm.module.css";
import type { NoteTag } from "../../types/note";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createNote } from "@/lib/api";

interface FormData {
  title: string;
  content: string;
  tag: NoteTag;
}

const defaultFormData: FormData = {
  title: "",
  content: "",
  tag: "Todo",
};

const OrderShema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Min length 3")
    .max(50, "Max length 50")
    .required("Required field"),
  content: Yup.string().max(500, "Max length 500"),
  tag: Yup.string()
    .required("Required field")
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"]),
});

interface NoteFormProps {
  onClose: () => void;
}

function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: (data) => {
      toast.success(`Added a new note with title "${data.title}"`, {
        position: "top-center",
        duration: 2500,
      });
      queryClient.invalidateQueries({ queryKey: ["note"] });
      onClose();
    },
    onError: () => {
      toast.error("Something went wrong", {
        position: "top-center",
        duration: 2500,
      });
    },
  });

  const handleSubmit = (
    values: FormData,
    formikHelpers: FormikHelpers<FormData> //взяла типізацію з onSubmit
  ) => {
    // тут відправимо на бекенд заповнену форму
    mutation.mutate(values);
    // console.log(formikHelpers); // тут можна подивитися методи
    formikHelpers.resetForm(); // повернення до дефолтного стану
  };

  return (
    <Formik
      initialValues={defaultFormData}
      onSubmit={handleSubmit}
      validationSchema={OrderShema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" className={css.error} component="span" />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" className={css.error} component="span" />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" className={css.error} component="span" />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={false}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}

export default NoteForm;

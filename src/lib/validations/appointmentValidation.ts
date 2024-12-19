import * as Yup from "yup";

export const appointmentValidationSchema = Yup.object({
  start: Yup.date()
    .required("La date de début est obligatoire")
    .test("today", "Nous vous prions de bien vouloir prendre rendez-vous au moins un jour à l'avance", function (value) {
      const today = new Date();
      today.setHours(23, 59, 59, 59);
      return value >= today;
    }),
  end: Yup.date()
    .required("La date de fin est obligatoire")
    .min(
      Yup.ref("start"),
      "La date de fin doit être postérieure à la date de début"
    )
    .test(
      "same-day",
      "La date de fin doit être le même jour que la date de début.",
      function (value) {
        const { start } = this.parent;
        if (!value || !start) return true;
        return (
          value.getFullYear() === start.getFullYear() &&
          value.getMonth() === start.getMonth() &&
          value.getDate() === start.getDate()
        );
      }
    ),
});

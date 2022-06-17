require("dotenv").config();

const testRECAP3 = (response: string) =>
  fetch(
    `https://www.google.com/recaptcha/api/siteverify?` +
      new URLSearchParams({
        secret: String(process.env.RECAPTCHA_SECRET),
        response,
      }),
    {}
  )
    .then((resp: { json: () => Promise<{ success: boolean }> }) => resp.json())
    .then((json: { success: boolean }) => {
      return json.success;
    })
    .catch(() => false);
export default testRECAP3;

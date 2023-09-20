/*
 * Contact form component for the front page
 */

import { createSignal } from "solid-js";

import classes from "./ContactForm.module.css";

const MANDATORY_FIELDS = ["name", "email", "message"]

function isValidEmail(email) {
  // Source: https://emailregex.com/
  return /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/.test(
    email
  )
}

/**
 * Returns true if the input string is empty (or null or undefined)
 *
 * @param {string} text
 */
function isEmpty(text) {
  if (text === undefined || text === null) return true
  if (text.trim().length < 1) return true

  return false
}

export function ContactForm() {
  const [values, setValues] = createSignal({})
  const [errors, setErrors] = createSignal({})
  const [formSubmitted, setFormSubmitted] = createSignal(false)

  const handleValueChange = (e) => {
    setValues({ ...values(), [e.target.name]: e.target.value })

    // Remove any errors for the field being edited
    if (errors()[e.target.name]) {
      let err = errors();
      delete err[e.target.name]
      setErrors(err)
    }
  }

  const validateForm = () => {
    let success = true
    const newErrors = {}

    MANDATORY_FIELDS.forEach((fieldName) => {
      if (isEmpty(values()[fieldName])) {
        newErrors[fieldName] = "Dette feltet er obligatorisk"
        success = false
      }
    })

    if (!isEmpty(values()["email"]) && !isValidEmail(values()["email"])) {
      newErrors["email"] =
        "Dette ser ikke ut til å være en gyldig E-postadresse"
      success = false
    }

    if (!success) {
      setErrors(newErrors)
      return false
    }

    setErrors({})
    return true
  }

  /*
   * Submits the form to Formcarry
   */
  const sendForm = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      const response = await fetch("https://formcarry.com/s/rGXRKGIYq2sH", {
        method: "POST",
        headers: {
          ContentType: "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(values()),
      });

      console.log("Got response from formcarry", response)

      if (!response.ok) {
        throw Error("Request failed");
      }

      setFormSubmitted(true)
    } catch (error) {
      console.error("Failed to submit form!", error)

      alert(
        "Innsending av skjema mislyktes dessverre. \n\n" +
        "Gjerne ta kontakt direkte via kontakt@avesta.no"
      )
    }
  }

  return (
    <>
      <div
        classList={{
          [classes["confirmation"]]: true,
          "hidden": !formSubmitted(),
        }}
      >
        Meldingen har blitt sendt!
      </div>

      <form
        id={classes["contact-form"]}
        class={formSubmitted() ? "hidden" : ""}
        onSubmit={sendForm}
      >
        <label>
          <div class={classes["field-name"]}>Navn</div>
          {errors()["name"] && <div class={classes["error"]}>{errors()["name"]}</div>}
          <input
            type="text"
            name="name"
            classList={{ [classes["error"]]: errors()["name"] }}
            value={values()["name"] || ""}
            onChange={handleValueChange}
          />
        </label>

        <label>
          <div class={classes["field-name"]}>E-postadresse</div>
          {errors()["email"] && <div class={classes["error"]}>{errors()["email"]}</div>}
          <input
            type="email"
            name="email"
            classList={{ [classes["error"]]: errors()["email"] }}
            value={values()["email"] || ""}
            onChange={handleValueChange}
          />
        </label>

        <label>
          <div class={classes["field-name"]}>Telefon</div>
          {errors()["phone"] && <div class={classes["error"]}>{errors()["phone"]}</div>}
          <input
            type="tel"
            name="phone"
            classList={{ [classes["error"]]: errors()["phone"] }}
            placeholder="Valgfritt"
            value={values()["phone"] || ""}
            onChange={handleValueChange}
          />
        </label>

        <label>
          <div class={classes["field-name"]}>Firma</div>
          {errors()["company"] && (
            <div class={classes["error"]}>{errors()["company"]}</div>
          )}
          <input
            type="text"
            name="company"
            classList={{ [classes["error"]]: errors()["company"] }}
            placeholder="Valgfritt"
            value={values()["company"] || ""}
            onChange={handleValueChange}
          />
        </label>

        <label>
          <div class={classes["field-name"]}>Melding</div>
          {errors()["message"] && (
            <div class={classes["error"]}>{errors()["message"]}</div>
          )}
          <textarea
            type="text"
            name="message"
            classList={{ [classes["error"]]: errors()["message"] }}
            value={values()["message"] || ""}
            onChange={handleValueChange}
          />
        </label>

        <label>
          <input type="submit" value="Send" />
        </label>

        {/*
        <input type="hidden" name="_gotcha" />
        */}
      </form>
    </>
  )
}

export default ContactForm;

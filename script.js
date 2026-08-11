/* =========================================
   TALENTFLOW AI
   JAVASCRIPT
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       CONFIGURACIÓN N8N
    ========================================== */

    const N8N_WEBHOOK_URL =
        "https://oscarluxx.app.n8n.cloud/webhook-test/talentflow/postulacion";

    /* =========================================
       MOBILE MENU
    ========================================== */

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const mobileMenu =
        document.getElementById("mobileMenu");

    if (mobileMenuBtn && mobileMenu) {

        mobileMenuBtn.addEventListener("click", () => {

            mobileMenu.classList.toggle("active");

            const icon =
                mobileMenuBtn.querySelector("i");

            if (mobileMenu.classList.contains("active")) {

                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");

            } else {

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

            }

        });


        /* Close mobile menu after navigation */

        const mobileLinks =
            mobileMenu.querySelectorAll("a");

        mobileLinks.forEach(link => {

            link.addEventListener("click", () => {

                mobileMenu.classList.remove("active");

                const icon =
                    mobileMenuBtn.querySelector("i");

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

            });

        });

    }


    /* =========================================
       CV UPLOAD
    ========================================== */

    const uploadArea =
        document.getElementById("uploadArea");

    const cvFile =
        document.getElementById("cvFile");

    const fileSelected =
        document.getElementById("fileSelected");

    const fileName =
        document.getElementById("fileName");

    const fileSize =
        document.getElementById("fileSize");

    const removeFile =
        document.getElementById("removeFile");

    const MAX_FILE_SIZE =
        5 * 1024 * 1024;


    /* =========================================
       CLICK UPLOAD AREA
    ========================================== */

    if (uploadArea && cvFile) {

        uploadArea.addEventListener("click", () => {
            cvFile.click();
        });


        /* Prevent duplicate click */

        cvFile.addEventListener("click", (event) => {
            event.stopPropagation();
        });


        /* File selected */

        cvFile.addEventListener("change", () => {

            if (cvFile.files.length > 0) {

                processFile(cvFile.files[0]);

            }

        });

    }


    /* =========================================
       PROCESS FILE
    ========================================== */

    function processFile(file) {

        /* Validate PDF */

        const isPDF =
            file.type === "application/pdf" ||
            file.name.toLowerCase().endsWith(".pdf");


        if (!isPDF) {

            showNotification(
                "Solo se permiten archivos PDF.",
                "error"
            );

            cvFile.value = "";

            return;

        }


        /* Validate size */

        if (file.size > MAX_FILE_SIZE) {

            showNotification(
                "El archivo no puede superar los 5 MB.",
                "error"
            );

            cvFile.value = "";

            return;

        }


        /* Display selected file */

        fileName.textContent =
            file.name;

        fileSize.textContent =
            formatFileSize(file.size);

        fileSelected.classList.add("active");

        uploadArea.style.display =
            "none";

    }


    /* =========================================
       FORMAT FILE SIZE
    ========================================== */

    function formatFileSize(bytes) {

        if (bytes < 1024) {

            return bytes + " B";

        }


        if (bytes < 1024 * 1024) {

            return (
                (bytes / 1024).toFixed(1) +
                " KB"
            );

        }


        return (
            (bytes / (1024 * 1024)).toFixed(2) +
            " MB"
        );

    }


    /* =========================================
       REMOVE FILE
    ========================================== */

    if (removeFile) {

        removeFile.addEventListener("click", (event) => {

            event.stopPropagation();

            cvFile.value = "";

            fileSelected.classList.remove("active");

            uploadArea.style.display =
                "flex";

        });

    }


    /* =========================================
       DRAG & DROP
    ========================================== */

    if (uploadArea) {

        [
            "dragenter",
            "dragover"
        ].forEach(eventName => {

            uploadArea.addEventListener(
                eventName,
                event => {

                    event.preventDefault();

                    uploadArea.classList.add(
                        "dragging"
                    );

                }
            );

        });


        [
            "dragleave",
            "drop"
        ].forEach(eventName => {

            uploadArea.addEventListener(
                eventName,
                event => {

                    event.preventDefault();

                    uploadArea.classList.remove(
                        "dragging"
                    );

                }
            );

        });


        uploadArea.addEventListener(
            "drop",
            event => {

                const files =
                    event.dataTransfer.files;

                if (!files.length) return;

                const file =
                    files[0];

                processFile(file);


                /*
                 * Actualizamos el input para que
                 * el formulario pueda utilizar
                 * el archivo.
                 */

                try {

                    const dataTransfer =
                        new DataTransfer();

                    dataTransfer.items.add(file);

                    cvFile.files =
                        dataTransfer.files;

                } catch (error) {

                    console.warn(
                        "No fue posible asignar el archivo al input.",
                        error
                    );

                }

            }
        );

    }


    /* =========================================
       FORM
    ========================================== */

    const form =
        document.getElementById("applicationForm");


    if (form) {

        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                /* =================================
                   VALIDATE CV
                ================================= */

                if (!cvFile.files.length) {

                    showNotification(
                        "Debes adjuntar tu hoja de vida en PDF.",
                        "error"
                    );

                    uploadArea.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                    return;

                }


                /* =================================
                   VALIDATE PRIVACY
                ================================= */

                const privacy =
                    document.getElementById("privacy");


                if (!privacy.checked) {

                    showNotification(
                        "Debes aceptar el tratamiento de datos personales.",
                        "error"
                    );

                    return;

                }


                /* =================================
                   GET FORM VALUES
                ================================= */

                const fullName =
                    document
                        .getElementById("fullName")
                        .value
                        .trim();


                const email =
                    document
                        .getElementById("email")
                        .value
                        .trim();


                const phone =
                    document
                        .getElementById("phone")
                        .value
                        .trim();


                const experience =
                    document
                        .getElementById("experience")
                        .value;


                const vacancy =
                    document
                        .getElementById("vacancy")
                        .value;


                const skills =
                    document
                        .getElementById("skills")
                        .value
                        .trim();


                const cv =
                    cvFile.files[0];


                /* =================================
                   VALIDATE REQUIRED DATA
                ================================= */

                if (!fullName) {

                    showNotification(
                        "Ingresa tu nombre completo.",
                        "error"
                    );

                    return;

                }


                if (!email) {

                    showNotification(
                        "Ingresa tu correo electrónico.",
                        "error"
                    );

                    return;

                }


                if (!phone) {

                    showNotification(
                        "Ingresa tu número telefónico.",
                        "error"
                    );

                    return;

                }


                if (!experience) {

                    showNotification(
                        "Selecciona tus años de experiencia.",
                        "error"
                    );

                    return;

                }


                if (!vacancy) {

                    showNotification(
                        "Selecciona una vacante.",
                        "error"
                    );

                    return;

                }


                if (!skills) {

                    showNotification(
                        "Ingresa tus tecnologías y conocimientos.",
                        "error"
                    );

                    return;

                }


                /* =================================
                   CHECK N8N URL
                ================================= */

                if (
                    !N8N_WEBHOOK_URL ||
                    N8N_WEBHOOK_URL.includes(
                        "PEGA_AQUI"
                    )
                ) {

                    showNotification(
                        "Primero debes configurar la URL del Webhook de n8n.",
                        "error"
                    );

                    console.error(
                        "Configura N8N_WEBHOOK_URL en script.js"
                    );

                    return;

                }


                /* =================================
                   BUTTON LOADING
                ================================= */

                const submitButton =
                    form.querySelector(
                        ".submit-button"
                    );


                const originalButtonHTML =
                    submitButton.innerHTML;


                submitButton.disabled = true;


                submitButton.innerHTML = `
                    <span>Procesando postulación...</span>
                    <i class="fa-solid fa-spinner fa-spin"></i>
                `;


                try {


                    /* =================================
                       FORM DATA
                    ================================= */

                    const formData =
                        new FormData();


                    formData.append(
                        "fullName",
                        fullName
                    );


                    formData.append(
                        "email",
                        email
                    );


                    formData.append(
                        "phone",
                        phone
                    );


                    formData.append(
                        "experience",
                        experience
                    );


                    formData.append(
                        "vacancy",
                        vacancy
                    );


                    formData.append(
                        "skills",
                        skills
                    );


                    formData.append(
                        "privacy",
                        privacy.checked
                    );


                    formData.append(
                        "cvFile",
                        cv,
                        cv.name
                    );


                    /* =================================
                       SEND TO N8N
                    ================================= */

                    console.log(
                        "Enviando postulación a n8n..."
                    );


                    const response =
                        await fetch(
                            N8N_WEBHOOK_URL,
                            {
                                method: "POST",
                                body: formData
                            }
                        );


                    /* =================================
                       CHECK RESPONSE
                    ================================= */

                    if (!response.ok) {

                        throw new Error(
                            `Error HTTP ${response.status}`
                        );

                    }


                    /* =================================
                       READ N8N RESPONSE
                    ================================= */

                    let result = null;


                    try {

                        result =
                            await response.json();

                    } catch (error) {

                        /*
                         * Si n8n todavía no devuelve
                         * JSON, no detenemos el proceso.
                         */

                        console.warn(
                            "n8n no devolvió JSON.",
                            error
                        );

                    }


                    console.log(
                        "Respuesta de n8n:",
                        result
                    );


                    /* =================================
                       APPLICATION ID
                    ================================= */

                    let generatedId =
                        null;


                    if (
                        result &&
                        result.applicationId
                    ) {

                        generatedId =
                            result.applicationId;

                    }


                    /*
                     * Mientras el workflow todavía
                     * no genere el ID, utilizamos
                     * uno temporal.
                     */

                    if (!generatedId) {

                        generatedId =
                            generateApplicationId();

                    }


                    /* =================================
                       SHOW SUCCESS
                    ================================= */

                    showSuccessModal(
                        generatedId
                    );


                    /* =================================
                       RESET FORM
                    ================================= */

                    form.reset();


                    cvFile.value = "";

                    fileSelected.classList.remove(
                        "active"
                    );

                    uploadArea.style.display =
                        "flex";


                } catch (error) {


                    /* =================================
                       ERROR
                    ================================= */

                    console.error(
                        "Error enviando postulación:",
                        error
                    );


                    showNotification(
                        "No fue posible enviar tu postulación. Intenta nuevamente.",
                        "error"
                    );


                } finally {


                    /* =================================
                       RESTORE BUTTON
                    ================================= */

                    submitButton.disabled = false;

                    submitButton.innerHTML =
                        originalButtonHTML;

                }

            }
        );

    }


    /* =========================================
       SUCCESS MODAL
    ========================================== */

    const successModal =
        document.getElementById(
            "successModal"
        );


    const closeModal =
        document.getElementById(
            "closeModal"
        );


    const modalButton =
        document.getElementById(
            "modalButton"
        );


    const applicationId =
        document.getElementById(
            "applicationId"
        );


    function showSuccessModal(id) {

        if (id) {

            applicationId.textContent =
                id;

        }


        successModal.classList.add(
            "active"
        );


        document.body.style.overflow =
            "hidden";

    }


    function hideSuccessModal() {

        successModal.classList.remove(
            "active"
        );


        document.body.style.overflow =
            "";

    }


    if (closeModal) {

        closeModal.addEventListener(
            "click",
            hideSuccessModal
        );

    }


    if (modalButton) {

        modalButton.addEventListener(
            "click",
            hideSuccessModal
        );

    }


    if (successModal) {

        successModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    successModal
                ) {

                    hideSuccessModal();

                }

            }
        );

    }


    /* =========================================
       ESC
    ========================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                successModal.classList.contains(
                    "active"
                )
            ) {

                hideSuccessModal();

            }

        }
    );


    /* =========================================
       TEMPORARY APPLICATION ID
    ========================================== */

    function generateApplicationId() {

        const year =
            new Date()
                .getFullYear();


        const random =
            Math.floor(
                1000 +
                Math.random() * 9000
            );


        return `TF-${year}-${random}`;

    }


    /* =========================================
       NOTIFICATION
    ========================================== */

    function showNotification(
        message,
        type = "info"
    ) {


        /* Remove existing notification */

        const existing =
            document.querySelector(
                ".custom-notification"
            );


        if (existing) {

            existing.remove();

        }


        /* Create notification */

        const notification =
            document.createElement(
                "div"
            );


        notification.className =
            "custom-notification";


        const icon =
            type === "error"
                ? "fa-circle-exclamation"
                : "fa-circle-info";


        notification.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span>${message}</span>
        `;


        document.body.appendChild(
            notification
        );


        /* Show */

        setTimeout(() => {

            notification.classList.add(
                "show"
            );

        }, 10);


        /* Remove */

        setTimeout(() => {

            notification.classList.remove(
                "show"
            );


            setTimeout(() => {

                notification.remove();

            }, 300);

        }, 4000);

    }

});
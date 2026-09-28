const form = document.getElementById("registrationForm");
const submitBtn = document.getElementById("submitBtn");

const studentNameInput =
    document.getElementById("studentName");

const studentMobileInput =
    document.getElementById("studentMobile");

const motherNameInput =
    document.getElementById("motherName");

const fatherNameInput =
    document.getElementById("fatherName");

const parentMobileInput =
    document.getElementById("parentMobile");

const qualificationInput =
    document.getElementById("qualification");

qualificationInput.disabled = true;

const collegeSection =
    document.getElementById("collegeSection");

const collegeInput =
    document.getElementById("college");


// ==========================================
// GOOGLE APPS SCRIPT URL
// ==========================================

const scriptURL =
    "https://script.google.com/macros/s/AKfycbw-KIBxK0FXT5Qk_awDXQaKMHdKKuRd62TiYJVmjxAeGWeiVSCfRHjNofT8lfAlJMgK/exec";


// ==========================================
// COLLEGE SECTION
// ==========================================

qualificationInput.addEventListener(
    "change",
    function () {

        if (this.value === "College") {

            collegeSection.style.display = "block";

            collegeInput.required = true;

        } else {

            collegeSection.style.display = "none";

            collegeInput.required = false;

            collegeInput.value = "";

        }

    }
);


// ==========================================
// CONVERT NAMES TO CAPITAL LETTERS
// ==========================================

studentNameInput.addEventListener(
    "input",
    function () {
        this.value = this.value.toUpperCase();
    }
);

motherNameInput.addEventListener(
    "input",
    function () {
        this.value = this.value.toUpperCase();
    }
);

fatherNameInput.addEventListener(
    "input",
    function () {
        this.value = this.value.toUpperCase();
    }
);


// ==========================================
// ALLOW ONLY NUMBERS
// ==========================================

function allowOnlyNumbers(input) {

    input.addEventListener(
        "input",
        function () {

            this.value = this.value
                .replace(/\D/g, "")
                .slice(0, 10);

        }
    );

}

allowOnlyNumbers(studentMobileInput);
allowOnlyNumbers(parentMobileInput);


// ==========================================
// FIELD-BY-FIELD RESTRICTION
// ==========================================

const villageInput = document.getElementById("village");
const constituencyInput = document.getElementById("constituency");
const masjidNameInput = document.getElementById("masjidName");


// Check whether a field has been properly filled
function isFieldFilled(field) {

    // Normal input / select
    if (
        field.tagName === "INPUT" ||
        field.tagName === "SELECT" ||
        field.tagName === "TEXTAREA"
    ) {
        return field.value.trim() !== "";
    }

    return true;
}


// Get all fields in the correct order
function getFormFields() {

    const fields = [
        studentNameInput,
        studentMobileInput,
        qualificationInput
    ];

    // Add college qualification only when College is selected
    if (qualificationInput.value === "College") {
        fields.push(collegeInput);
    }

    fields.push(
        motherNameInput,
        fatherNameInput,
        parentMobileInput,
        villageInput,
        constituencyInput
    );

    // Qur'an radio buttons
    fields.push(
        document.querySelector(
            'input[name="quranArabic"]:checked'
        )
    );

    fields.push(masjidNameInput);

    return fields;
}


// Prevent jumping directly to later fields
form.addEventListener("focusin", function (event) {

    const target = event.target;

    // Ignore the Submit button
    if (target.id === "submitBtn") {
        return;
    }

    const fields = getFormFields();

    const targetIndex = fields.indexOf(target);

    // If this isn't one of our controlled fields
    if (targetIndex === -1) {
        return;
    }

    // Check all fields before the current field
    for (let i = 0; i < targetIndex; i++) {

        const previousField = fields[i];

        // Radio button group
        if (
            previousField &&
            previousField.type === "radio"
        ) {

            const radioSelected =
                document.querySelector(
                    'input[name="quranArabic"]:checked'
                );

            if (!radioSelected) {

                alert(
                    "Please answer the previous question before continuing."
                );

                previousField.focus();

                return;
            }

            continue;
        }


        // Normal field
        if (
    previousField &&
    !isFieldFilled(previousField)
) {

    alert(
        "Please complete the previous field before continuing."
    );

    previousField.focus();

    return;
}


// ==========================================
// SPECIAL CHECK FOR STUDENT MOBILE
// ==========================================

if (previousField === studentMobileInput) {

    // Mobile is currently being checked
    if (mobileCheckInProgress) {

        studentMobileInput.focus();

        return;
    }


    // Mobile is already registered
    if (mobileAlreadyRegistered) {

        studentMobileInput.focus();

        return;
    }


    // Mobile has not been checked yet
    if (!/^[6-9][0-9]{9}$/.test(
        studentMobileInput.value.trim()
    )) {

        studentMobileInput.focus();

        return;
    }
}
    }

});

// ==========================================
// STUDENT MOBILE NUMBER CHECK
// ==========================================

let mobileCheckInProgress = false;
let mobileAlreadyRegistered = false;


// ==========================================
// CLEAR MOBILE CHECK WHEN NUMBER CHANGES
// ==========================================

studentMobileInput.addEventListener("input", function () {

    // Reset previous result
    mobileAlreadyRegistered = false;
    mobileCheckInProgress = false;
    
qualificationInput.disabled = true;

    const message =
        document.getElementById("studentMobileMessage");

    message.textContent = "";
});


// ==========================================
// CHECK STUDENT MOBILE NUMBER
// ==========================================

function checkStudentMobile(callback) {

    const mobile =
        studentMobileInput.value.trim();

    const message =
        document.getElementById("studentMobileMessage");


    // ------------------------------------------
    // CHECK 1: MOBILE MUST BE 10 DIGITS
    // ------------------------------------------

    if (!/^[6-9][0-9]{9}$/.test(mobile)) {

        message.textContent =
            "Please enter a valid 10-digit mobile number.";

        studentMobileInput.focus();

        callback(false);

        return;
    }


    // ------------------------------------------
    // ALREADY CHECKING
    // ------------------------------------------

    if (mobileCheckInProgress) {
        callback(false);
        return;
    }


    // ------------------------------------------
    // ALREADY REGISTERED
    // ------------------------------------------

    if (mobileAlreadyRegistered) {
        callback(false);
        return;
    }


    // ------------------------------------------
    // SHOW CHECKING MESSAGE
    // ------------------------------------------

    message.textContent =
        "Checking mobile number...";

    message.style.color = "red";


    mobileCheckInProgress = true;


    // ------------------------------------------
    // CREATE JSONP CALLBACK
    // ------------------------------------------

    const callbackName =
        "mobileCheckCallback_" + Date.now();

    let completed = false;


    window[callbackName] = function (response) {

        completed = true;

        mobileCheckInProgress = false;

        delete window[callbackName];


        // --------------------------------------
        // MOBILE ALREADY REGISTERED
        // --------------------------------------

        if (
            response &&
            response.success
        ) {

            mobileAlreadyRegistered = true;


            message.innerHTML =
                'You are already registered with this mobile number. ' +
                'Please visit <strong>Already Registered</strong> menu for details.';


            message.style.color = "red";


            studentMobileInput.focus();


            callback(false);

            return;
        }


        // --------------------------------------
        // MOBILE NOT REGISTERED
        // --------------------------------------

        mobileAlreadyRegistered = false;

        message.textContent = "";

        callback(true);
    };


    // ------------------------------------------
    // CREATE APPS SCRIPT URL
    // ------------------------------------------

    const url =
        scriptURL +
        "?action=getDetails" +
        "&studentMobile=" +
        encodeURIComponent(mobile) +
        "&callback=" +
        encodeURIComponent(callbackName);


    // ------------------------------------------
    // CREATE SCRIPT REQUEST
    // ------------------------------------------

    const script =
        document.createElement("script");

    script.src = url;
    script.async = true;


    // ------------------------------------------
    // ERROR
    // ------------------------------------------

    script.onerror = function () {

        if (completed) {
            return;
        }


        mobileCheckInProgress = false;

        delete window[callbackName];

        script.remove();


        message.textContent =
            "Unable to check this mobile number. Please try again.";

        message.style.color = "red";


        studentMobileInput.focus();

        callback(false);
    };


    // ------------------------------------------
    // TIMEOUT
    // ------------------------------------------

    const timeout =
        setTimeout(function () {

            if (!completed) {

                mobileCheckInProgress = false;

                delete window[callbackName];

                script.remove();


                message.textContent =
                    "The server is taking too long to respond. Please try again.";

                message.style.color = "red";


                studentMobileInput.focus();

                callback(false);
            }

        }, 20000);


    // ------------------------------------------
    // SUCCESSFUL REQUEST
    // ------------------------------------------

    script.onload = function () {

        clearTimeout(timeout);

        setTimeout(function () {

            script.remove();

        }, 100);

    };


    document.body.appendChild(script);
}

// ==========================================
// CHECK MOBILE BEFORE MOVING TO NEXT FIELD
// ==========================================

studentMobileInput.addEventListener(
    "blur",
    function () {

        const mobile =
            studentMobileInput.value.trim();

        // Don't check empty mobile number
        if (mobile === "") {
            return;
        }

        // Don't check incomplete/invalid number
        if (!/^[6-9][0-9]{9}$/.test(mobile)) {
            return;
        }

        // Check Google Sheet
       checkStudentMobile(function (isValid) {

    if (!isValid) {
        studentMobileInput.focus();
        return;
    }

    // Mobile is valid and NOT registered.
    qualificationInput.disabled = false;
    qualificationInput.focus();

});

    }
);
// ==========================================
// REGISTRATION FORM
// ==========================================

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const studentName =
            studentNameInput.value.trim();

        const studentMobile =
            studentMobileInput.value.trim();

        const qualification =
            qualificationInput.value.trim();

        let college = "-";

        if (qualification === "College") {
            college = collegeInput.value;
        }

        const motherName =
            motherNameInput.value.trim();

        const fatherName =
            fatherNameInput.value.trim();

        const parentMobile =
            parentMobileInput.value.trim();

        const village =
            document
                .getElementById("village")
                .value.trim();

        const constituency =
            document
                .getElementById("constituency")
                .value;

        const quranArabic =
            document.querySelector(
                'input[name="quranArabic"]:checked'
            ).value;

        const masjidName =
            document
                .getElementById("masjidName")
                .value;


        // ==========================================
        // MOBILE VALIDATION
        // ==========================================

        const mobilePattern =
            /^[6-9][0-9]{9}$/;


        if (!mobilePattern.test(studentMobile)) {

            alert(
                "Please enter a valid 10-digit Student Mobile Number starting with 6, 7, 8 or 9."
            );

            studentMobileInput.focus();

            return;
        }


        if (!mobilePattern.test(parentMobile)) {

            alert(
                "Please enter a valid 10-digit Parent Mobile Number starting with 6, 7, 8 or 9."
            );

            parentMobileInput.focus();

            return;
        }


        // ==========================================
        // DISABLE BUTTON
        // ==========================================

        submitBtn.disabled = true;

        submitBtn.textContent = "Submitting...";


        // ==========================================
        // UNIQUE CALLBACK
        // ==========================================

        const callbackName =
            "googleSheetCallback_" +
            Date.now();

        let completed = false;


        // ==========================================
        // CALLBACK
        // ==========================================

        window[callbackName] =
            function (response) {

                completed = true;


                if (
                    response &&
                    response.success
                ) {

                    // Fill popup details

                    document
                        .getElementById("popupParticipant")
                        .textContent =
                        response.studentName ||
                        studentName;


                    document
                        .getElementById("popupRegistrationId")
                        .textContent =
                        response.registrationId;


                    // This is the NEW registration popup

                    document
                        .getElementById("popupHeading")
                        .textContent =
                        "Registration Successful";


                    document
                        .getElementById("successPopup")
                        .style.display =
                        "flex";


                    form.reset();

                }


                else if (
                    response &&
                    response.alreadyRegistered
                ) {

                    alert(
                        "You are already registered.\n\n" +
                        "Your Registration ID: " +
                        response.registrationId
                    );

                }


                else {

                    alert(
                        response &&
                        response.message
                            ? response.message
                            : "Registration failed. Please try again."
                    );

                }


                submitBtn.disabled = false;

                submitBtn.textContent = "Submit";

                delete window[callbackName];

            };


        // ==========================================
        // CREATE REQUEST URL
        // ==========================================

        const url =
            scriptURL +

            "?studentName=" +
            encodeURIComponent(studentName) +

            "&studentMobile=" +
            encodeURIComponent(studentMobile) +

            "&qualification=" +
            encodeURIComponent(qualification) +

            "&college=" +
            encodeURIComponent(college) +

            "&motherName=" +
            encodeURIComponent(motherName) +

            "&fatherName=" +
            encodeURIComponent(fatherName) +

            "&parentMobile=" +
            encodeURIComponent(parentMobile) +

            "&village=" +
            encodeURIComponent(village) +

            "&constituency=" +
            encodeURIComponent(constituency) +

            "&quranArabic=" +
            encodeURIComponent(quranArabic) +

            "&masjidName=" +
            encodeURIComponent(masjidName) +

            "&callback=" +
            encodeURIComponent(callbackName);


        // ==========================================
        // SEND JSONP REQUEST
        // ==========================================

        const script =
            document.createElement("script");

        script.src = url;

        script.async = true;


        // ==========================================
        // ERROR
        // ==========================================

        script.onerror = function () {

            if (completed) {
                return;
            }

            alert(
                "Unable to connect to the registration server. Please check your internet connection and try again."
            );

            submitBtn.disabled = false;

            submitBtn.textContent = "Submit";

            delete window[callbackName];

            script.remove();

        };


        // ==========================================
        // TIMEOUT
        // ==========================================

        const timeout =
            setTimeout(
                function () {

                    if (!completed) {

                        alert(
                            "The server is taking too long to respond. Please try again."
                        );

                        submitBtn.disabled = false;

                        submitBtn.textContent =
                            "Submit";

                        delete window[callbackName];

                        script.remove();

                    }

                },
                20000
            );


        script.onload = function () {

            clearTimeout(timeout);

            setTimeout(
                function () {
                    script.remove();
                },
                100
            );

        };


        document.body.appendChild(script);

    }
);


// ==========================================
// ALREADY REGISTERED POPUP
// ==========================================

function openAlreadyRegisteredPopup() {

    document
        .getElementById("alreadyRegisteredPopup")
        .style.display = "flex";


    document
        .getElementById("registeredMobile")
        .value = "";


    setTimeout(
        function () {

            document
                .getElementById("registeredMobile")
                .focus();

        },
        100
    );

}


// ==========================================
// CLOSE ALREADY REGISTERED POPUP
// ==========================================

function closeAlreadyRegisteredPopup() {

    document
        .getElementById("alreadyRegisteredPopup")
        .style.display = "none";

}


// ==========================================
// ALLOW ONLY NUMBERS IN LOOKUP BOX
// ==========================================

document
    .getElementById("registeredMobile")
    .addEventListener(
        "input",
        function () {

            this.value =
                this.value
                    .replace(/\D/g, "")
                    .slice(0, 10);

        }
    );


// ==========================================
// GET REGISTERED DETAILS
// ==========================================

function getRegisteredDetails() {

    const mobile =
        document
            .getElementById("registeredMobile")
            .value
            .trim();


    const mobilePattern =
        /^[6-9][0-9]{9}$/;


    if (!mobilePattern.test(mobile)) {

        alert(
            "Please enter a valid 10-digit mobile number starting with 6, 7, 8 or 9."
        );

        return;
    }


    const getDetailsBtn =
        document.getElementById(
            "getDetailsBtn"
        );


    getDetailsBtn.disabled = true;

    getDetailsBtn.textContent =
        "Getting Details...";


    const callbackName =
        "registeredDetailsCallback_" +
        Date.now();


    let completed = false;


    window[callbackName] =
        function (response) {

            completed = true;


            getDetailsBtn.disabled = false;

            getDetailsBtn.textContent =
                "Get Details";


            delete window[callbackName];


            if (
                response &&
                response.success
            ) {

                // Close mobile number popup

                closeAlreadyRegisteredPopup();


                // Fill details popup

                document
                    .getElementById(
                        "popupParticipant"
                    )
                    .textContent =
                    response.studentName;


                document
                    .getElementById(
                        "popupRegistrationId"
                    )
                    .textContent =
                    response.registrationId;


                // IMPORTANT:
                // Do NOT show "Registration Successful"

                document
                    .getElementById(
                        "popupHeading"
                    )
                    .textContent =
                    "Registration Details";


                document
                    .getElementById(
                        "successPopup"
                    )
                    .style.display =
                    "flex";

            }

            else {

                alert(
                    response &&
                    response.message
                        ? response.message
                        : "Registration details not found."
                );

            }

        };


    const url =
        scriptURL +

        "?action=getDetails" +

        "&studentMobile=" +
        encodeURIComponent(mobile) +

        "&callback=" +
        encodeURIComponent(callbackName);


    const script =
        document.createElement("script");


    script.src = url;

    script.async = true;


    script.onerror = function () {

        if (completed) {
            return;
        }


        getDetailsBtn.disabled = false;

        getDetailsBtn.textContent =
            "Get Details";


        delete window[callbackName];

        script.remove();


        alert(
            "Unable to connect to the registration server. Please try again."
        );

    };


    const timeout =
        setTimeout(
            function () {

                if (!completed) {

                    getDetailsBtn.disabled = false;

                    getDetailsBtn.textContent =
                        "Get Details";

                    delete window[callbackName];

                    script.remove();

                    alert(
                        "The server is taking too long to respond. Please try again."
                    );

                }

            },
            20000
        );


    script.onload = function () {

        clearTimeout(timeout);

        setTimeout(
            function () {
                script.remove();
            },
            100
        );

    };


    document.body.appendChild(script);

}


// ==========================================
// COPY REGISTRATION DETAILS
// ==========================================

function copyRegistrationDetails() {

    const participant =
        document
            .getElementById(
                "popupParticipant"
            )
            .textContent;


    const registrationId =
        document
            .getElementById(
                "popupRegistrationId"
            )
            .textContent;


    const details =
`ONE DAY ISLAMIC TRAINING WORKSHOP

Participant: ${participant}
Registration ID: ${registrationId}
Date: 11 October 2026
Venue: AR AR Function Hall, Kodad
Reporting Time: 8:30 AM`;


    navigator.clipboard
        .writeText(details)
        .then(
            function () {

                const copyBtn =
                    document.getElementById(
                        "copyBtn"
                    );

                copyBtn.textContent =
                    "Copied!";


                setTimeout(
                    function () {

                        copyBtn.textContent =
                            "Copy";

                    },
                    2000
                );

            }
        )
        .catch(
            function () {

                alert(
                    "Unable to copy the registration details."
                );

            }
        );

}


// ==========================================
// DOWNLOAD REGISTRATION DETAILS AS PDF
// ==========================================

function downloadRegistrationDetails() {

    const participant =
        document
            .getElementById(
                "popupParticipant"
            )
            .textContent;


    const registrationId =
        document
            .getElementById(
                "popupRegistrationId"
            )
            .textContent;


    const {
        jsPDF
    } = window.jspdf;


    const pdf =
        new jsPDF();


    // Title

    pdf.setFontSize(18);

    pdf.setFont(undefined, "bold");

    pdf.text(
        "ONE DAY ISLAMIC TRAINING WORKSHOP",
        105,
        25,
        {
            align: "center"
        }
    );


    // Line

    pdf.setLineWidth(0.5);

    pdf.line(
        20,
        32,
        190,
        32
    );


    // Details

    pdf.setFontSize(12);

    pdf.setFont(undefined, "normal");


    pdf.text(
        "Participant:",
        25,
        50
    );

    pdf.text(
        participant,
        75,
        50
    );


    pdf.text(
        "Registration ID:",
        25,
        62
    );

    pdf.text(
        registrationId,
        75,
        62
    );


    pdf.text(
        "Date:",
        25,
        74
    );

    pdf.text(
        "11 October 2026",
        75,
        74
    );


    pdf.text(
        "Venue:",
        25,
        86
    );

    pdf.text(
        "AR AR Function Hall, Kodad",
        75,
        86
    );


    pdf.text(
        "Reporting Time:",
        25,
        98
    );

    pdf.text(
        "8:30 AM",
        75,
        98
    );


    // Footer

    pdf.setFontSize(10);

    pdf.text(
        "Please keep this registration details safely.",
        105,
        120,
        {
            align: "center"
        }
    );


    // Download

    pdf.save(
        "Registration_" +
        registrationId +
        ".pdf"
    );

}


// ==========================================
// CLOSE SUCCESS / DETAILS POPUP
// ==========================================

function closePopup() {

    document
        .getElementById(
            "successPopup"
        )
        .style.display =
        "none";

}

const form = document.getElementById("registrationForm");
const submitBtn = document.getElementById("submitBtn");

const studentNameInput = document.getElementById("studentName");
const studentMobileInput = document.getElementById("studentMobile");
const motherNameInput = document.getElementById("motherName");
const fatherNameInput = document.getElementById("fatherName");
const parentMobileInput = document.getElementById("parentMobile");
const qualificationInput =
    document.getElementById("qualification");

const collegeSection =
    document.getElementById("collegeSection");

const collegeInput =
    document.getElementById("college");
    qualificationInput.addEventListener("change", function () {

    if (this.value === "College") {

        collegeSection.style.display = "block";
        collegeInput.required = true;

    } else {

        collegeSection.style.display = "none";
        collegeInput.required = false;
        collegeInput.value = "";

    }

});


// ===============================
// CONVERT NAMES TO CAPITAL LETTERS
// ===============================

studentNameInput.addEventListener("input", function () {
    this.value = this.value.toUpperCase();
});
motherNameInput.addEventListener("input", function () {
    this.value = this.value.toUpperCase();
});
fatherNameInput.addEventListener("input", function () {
    this.value = this.value.toUpperCase();
});


// ===============================
// ALLOW ONLY NUMBERS IN MOBILE
// ===============================

function allowOnlyNumbers(input) {

    input.addEventListener("input", function () {

        this.value = this.value
            .replace(/\D/g, "")
            .slice(0, 10);

    });

}

allowOnlyNumbers(studentMobileInput);
allowOnlyNumbers(parentMobileInput);


// ===============================
// FORM SUBMISSION
// ===============================

form.addEventListener("submit", function (event) {

    event.preventDefault();


    // Get values

    const studentName =
        studentNameInput.value.trim();

    const studentMobile =
        studentMobileInput.value.trim();

    const qualification =
        document.getElementById("qualification")
        .value.trim();
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
        document.getElementById("village")
        .value.trim();

    const constituency =
        document.getElementById("constituency").value;

        const quranArabic =
    document.querySelector('input[name="quranArabic"]:checked').value;

         const masjidName=
    document.getElementById("masjidName").value;
    // ===============================
    // MOBILE NUMBER VALIDATION
    // ===============================

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


    // ===============================
    // DISABLE BUTTON
    // ===============================

    submitBtn.disabled = true;

    submitBtn.textContent = "Submitting...";


    // ===============================
    // GOOGLE APPS SCRIPT URL
    // ===============================

    const scriptURL =
        "https://script.google.com/macros/s/AKfycbzCpeQJG2OvhLiy2ZVxAZkN9SimPcs6yv6PuhDajzTKdUjhVEWc27o7mLFeDv0RaYSA/exec";


    // ===============================
    // UNIQUE CALLBACK
    // ===============================

    const callbackName =
        "googleSheetCallback_" +
        Date.now();


    let completed = false;


    // ===============================
    // CALLBACK FUNCTION
    // ===============================

    window[callbackName] = function (response) {

        completed = true;


        if (response && response.success) {

            document.getElementById("successMessage").textContent =
                "Registration ID: " +
                response.registrationId;

            document.getElementById("successPopup").style.display =
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
                response && response.message
                    ? response.message
                    : "Registration failed. Please try again."
            );

        }


        submitBtn.disabled = false;

        submitBtn.textContent = "Submit";


        delete window[callbackName];

    };


    // ===============================
    // CREATE REQUEST URL
    // ===============================

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


    // ===============================
    // CREATE JSONP SCRIPT
    // ===============================

    const script =
        document.createElement("script");


    script.src = url;

    script.async = true;


    // ===============================
    // ERROR HANDLING
    // ===============================

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


    // ===============================
    // TIMEOUT
    // ===============================

    const timeout =
        setTimeout(function () {

            if (!completed) {

                alert(
                    "The server is taking too long to respond. Please try again."
                );

                submitBtn.disabled = false;

                submitBtn.textContent = "Submit";

                delete window[callbackName];

                script.remove();

            }

        }, 20000);


    // ===============================
    // SUCCESSFUL LOAD
    // ===============================

    script.onload = function () {

        clearTimeout(timeout);

        setTimeout(function () {
            script.remove();
        }, 100);

    };


    // ===============================
    // SEND REQUEST
    // ===============================

    document.body.appendChild(script);

});


// ===============================
// CLOSE SUCCESS POPUP
// ===============================

function closePopup() {

    document.getElementById("successPopup")
        .style.display = "none";

}
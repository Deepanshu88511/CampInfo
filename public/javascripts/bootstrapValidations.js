(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

function updateRatingValue(value) {
  document.getElementById('ratingValue').textContent = value;
}

// JavaScript function to update the rating value display
function updateRatingValue(value) {
  document.getElementById('ratingValue').innerText = value;
}
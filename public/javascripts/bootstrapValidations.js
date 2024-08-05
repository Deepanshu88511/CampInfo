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


// file input customization


document.querySelector('.custom-file-input').addEventListener('change', function (e) {
  const files = Array.from(this.files);
  const fileNames = files.map(file => file.name).join(', ');
  document.querySelector('.custom-file-label').textContent = fileNames || 'Choose files...';
  document.getElementById('file-names').textContent = fileNames;
});



// deleting images edit form 
document.querySelectorAll('.delete-image').forEach(button => {
  button.addEventListener('click', function(e) {
    const filename = this.dataset.filename;

    // Create a hidden input to delete the image
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'deleteImages[]'; // Ensure this matches what you're expecting on the server side
    input.value = filename; // Use filename instead of index
    document.querySelector('form').appendChild(input);

    // Remove the image thumbnail from the DOM
    this.parentElement.parentElement.remove();
  });
});
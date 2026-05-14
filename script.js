 const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const contactList = document.getElementById('contactList');
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearBtn');
    const saveBtn = document.getElementById('saveBtn');
    const formTitle = document.getElementById('formTitle');
    const status = document.getElementById('status');

    let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    let editIndex = null;

    function saveToStorage() {
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    function setStatus(message) {
      status.textContent = message;
      if (message) {
        setTimeout(() => {
          if (status.textContent === message) status.textContent = '';
        }, 2500);
      }
    }

    function renderContacts(filter = '') {
      contactList.innerHTML = '';
      const term = filter.toLowerCase();

      const filteredContacts = contacts.filter(contact => {
        return (
          contact.name.toLowerCase().includes(term) ||
          contact.phone.toLowerCase().includes(term) ||
          contact.email.toLowerCase().includes(term)
        );
      });

      if (filteredContacts.length === 0) {
        contactList.innerHTML = `<tr><td class="empty" colspan="4">No contacts found.</td></tr>`;
        return;
      }

      filteredContacts.forEach((contact, index) => {
        const actualIndex = contacts.findIndex(c => c.id === contact.id);
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${contact.name}</td>
          <td>${contact.phone}</td>
          <td>${contact.email}</td>
          <td>
            <button class="btn-secondary action-btn" onclick="editContact(${actualIndex})">Edit</button>
            <button class="btn-danger action-btn" onclick="deleteContact(${actualIndex})">Delete</button>
          </td>
        `;
        contactList.appendChild(row);
      });
    }

    function resetForm() {
      contactForm.reset();
      editIndex = null;
      formTitle.textContent = 'Add Contact';
      saveBtn.textContent = 'Add Contact';
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const contact = {
        id: editIndex !== null ? contacts[editIndex].id : Date.now(),
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        email: emailInput.value.trim()
      };

      if (editIndex === null) {
        contacts.push(contact);
        setStatus('Contact added successfully.');
      } else {
        contacts[editIndex] = contact;
        setStatus('Contact updated successfully.');
      }

      saveToStorage();
      renderContacts(searchInput.value);
      resetForm();
    });

    clearBtn.addEventListener('click', () => {
      resetForm();
      setStatus('Form cleared.');
    });

    searchInput.addEventListener('input', () => {
      renderContacts(searchInput.value);
    });

    function editContact(index) {
      editIndex = index;
      nameInput.value = contacts[index].name;
      phoneInput.value = contacts[index].phone;
      emailInput.value = contacts[index].email;
      formTitle.textContent = 'Edit Contact';
      saveBtn.textContent = 'Update Contact';
      nameInput.focus();
      setStatus('Editing contact...');
    }

    function deleteContact(index) {
      const confirmDelete = confirm('Are you sure you want to delete this contact?');
      if (!confirmDelete) return;

      contacts.splice(index, 1);
      saveToStorage();
      renderContacts(searchInput.value);
      setStatus('Contact deleted successfully.');

      if (editIndex === index) {
        resetForm();
      }
    }

    // Make functions available to inline buttons
    window.editContact = editContact;
    window.deleteContact = deleteContact;

    renderContacts();
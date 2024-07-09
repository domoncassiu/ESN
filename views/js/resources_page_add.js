document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const addressInput = document.getElementById('address');
  const addressFromUrl = urlParams.get('address');
  if (addressFromUrl) {
    addressInput.value = addressFromUrl;
    addressInput.setAttribute('readonly', true);
  }
  document
    .getElementById('resourceForm')
    .addEventListener('submit', async function (event) {
      event.preventDefault(); // 阻止表单默认提交行为

      // 获取表单字段的值
      let name = document.getElementById('name').value;
      let address = document.getElementById('address').value;
      let details = document.getElementById('details').value;

      let addressTip = document.getElementById('addressTip');
      let detailsTip = document.getElementById('detailsTip');
      let nameTip = document.getElementById('nameTip');

      if (!address) {
        addressTip.innerText = 'Address cannot be empty';
        return;
      }
      if (!nameTip) {
        nameTip.innerText = 'name cannot be empty';
        return;
      }
      if (address.length > 40) {
        addressTip.innerHTML = 'Address should be less than 40 characters';
        return;
      }
      const response = await fetch('/resource', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: name,
          location: address,
          additionalInfo: details,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
      window.location.href = '../html/resources_page_add_submit_success.html';
    });
});

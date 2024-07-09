document.addEventListener('DOMContentLoaded', () => {
  function getQueryParam(param) {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get(param);
  }
  document
    .getElementById('resourceForm')
    .addEventListener('submit', async function (event) {
      event.preventDefault(); // 阻止表单默认提交行为

      // 获取表单字段的值
      let address = document.getElementById('address').value;
      let details = document.getElementById('details').value;
      let addressTip = document.getElementById('addressTip');
      let detailsTip = document.getElementById('detailsTip');
      detailsTip.innerText = '';
      addressTip.innerText = '';
      if (!address) {
        addressTip.innerHTML = 'Quantity cannot be empty';
        return;
      }
      if (details.length > 40) {
        detailsTip.innerHTML = 'Address should be less than 40 characters';
        return;
      }
      if (!details) {
        detailsTip.innerText = 'Address cannot be empty';
        return;
      }

      const response = await fetch('/resourceHelp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          resource: getQueryParam('resource'),
          quantityOffered: address,
          address: details,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
      window.location.href = '../html/resources_page_add_success.html';
    });
});

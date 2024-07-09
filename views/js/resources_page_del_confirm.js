document.addEventListener('DOMContentLoaded', () => {
  function getQueryParam(param) {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get(param);
  }

  document.querySelector('#handelDel').onclick = async () => {
    const response = await fetch(`/resource/del/${getQueryParam('resource')}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const responseData = await response.json();
    window.location.href = '../html/resources_page.html?isMe=ok';
  };
});

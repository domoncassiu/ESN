import { genericGet } from './endpoints.js';

// on page load:
document.addEventListener('DOMContentLoaded', async () => {
  // fetch the latest images for each album to use as thumbnail
  let albumContainer = document.getElementById('album-container');
  let albumNames = await genericGet('/galleries/allalbums');
  for (let album of albumNames.folders) {
    let toAppend = makeLink(album.slice(0, -1));
    console.log(album);
    albumContainer.appendChild(toAppend);
  }
  console.log('YAHOOO');
  console.log(albumNames);
});

function makeLink(albumName) {
  // Create the <a> element
  const link = document.createElement('a');

  // Set the href attribute
  link.setAttribute('href', `album_view.html?albumName=${albumName}`);
  link.setAttribute('class', 'group');

  // Create the <div> element
  const div = document.createElement('div');
  div.setAttribute('class', 'flex flex-col items-center');

  // Create the <img> element
  const img = document.createElement('img');
  img.setAttribute(
    'class',
    'h-[15vh] md:h-[29vh] md:w-96 max-w-full rounded-lg border-2 border-black',
  );
  img.setAttribute(
    'src',
    'https://esn-gallery.s3.us-west-1.amazonaws.com/shelterthumb.png',
  );
  img.setAttribute('alt', '');

  // Create the <h1> element
  const h1 = document.createElement('h1');
  h1.setAttribute('class', 'text-3xl mt-1');
  h1.textContent = albumName;

  // Append the <img> and <h1> elements to the <div> element
  div.appendChild(img);
  div.appendChild(h1);

  // Append the <div> element to the <a> element
  link.appendChild(div);

  // Append the <a> element to the document body or any other desired parent element
  return link;
}

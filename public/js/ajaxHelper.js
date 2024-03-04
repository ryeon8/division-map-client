export default {
  get: (url, returnType) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);

      xhr.onload = function () {
        if (xhr.status == 200) {
          let result = xhr.responseText;
          if (returnType === 'json' || url.endsWith('json')) {
            result = JSON.parse(result);
          }

          resolve(result);
        } else {
          reject(xhr.status);
        }
      }

      xhr.onerror = function (err) {
        reject(err);
      }

      xhr.send();
    });
  }
}
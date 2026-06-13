const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const form = new FormData();
form.append('file', fs.createReadStream('Expenses Export.csv'));
form.append('groupId', '229cd55c-ec17-4cf8-b0e9-bf97727c6ed0');

axios.post('http://localhost:3000/api/v1/import/upload', form, {
  headers: {
    ...form.getHeaders(),
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZjNzk0Njk0LWM1NzktNDczZi05Y2E0LTg3NDRjMGQ4YmI3MSIsImlhdCI6MTc4MTM3NjkxOSwiZXhwIjoxNzgzOTY4OTE5fQ.sULzr2giNxwq2YC-eT8Xz4yRO1Tlw3mYs8oZh-ipw10'
  }
})
.then(res => console.log('Success:', res.data))
.catch(err => console.error('Error:', err.response ? err.response.data : err.message));
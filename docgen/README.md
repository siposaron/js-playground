# Generate Office binaries from templates

The app lists the placeholders from the docx, pptx, xlsx templates and can generate new files by passing in values for each placeholder. The values will replace the placeholders.

Format of placeholder inside the documents: `${placeholder}`

# Run

`npm start`

or

`npm run start:dev`

The application starts on localhost, port 3000.

1. List placeholders:

`curl --location --request GET 'http://localhost:3000/placeholders'`

2. Generate binaries

```
curl --location --request POST 'http://localhost:3000/generate' \
--header 'Content-Type: application/json' \
--data-raw '{
    "firstName": "Alon",
    "lastName": "Bar",
    "first": "First text",
    "second": "Second text",
    "LAST": "Very important\ntext here!"
  }'
```

Files are written into the project root: output.docx, output.pptx, output.xlsx


# Smart Cart

Smart Cart is a modern e-commerce web application with a **Node.js + Express** backend and a **Next.js** frontend.  
It’s designed for smooth shopping experiences, fast performance, and easy maintainability.




## Installation

Install pnpm

```bash
  npm install -g pnpm@latest-10
```

Install Client Dependancies

```bash
  pnpm install
  cd ecommerce-client
```

Install Server Dependancies

```bash
  pnpm install
  cd ecommerce-backend
```


    
## Environment Variables

**Before Run the Project. You need to Add Sample Data In the Server side**

`pnpm run seed`

To run this project, you will need to add the following environment variables to your .env file
in **Server Side**

`API_KEY`

`ANOTHER_API_KEY`

`MONGODB_URI`=`mongodb://localhost:27017/ecommerce`

`PORT`=`5000`

`JWT_SECRET`=`MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz5lLZU+B2W3Sj1O92WOFxdU1HgMfiqAXgCYv4DuiAUW2hB8nkrh6BQL4sw47B+ENqAFCeZp9/PNVgtefmDRRfL4e5US/P6qogJVPhZqQMB069hqrJH9CwuWm9CfxQOicO2Fwaswqp779nj6IspxdLj65qS1F4HKXvKjA1z9eZviBzImQULqCwzW6a6nRZSSvhE7l9be9jel47ePf/rzVvLsfWSK8ZfZC0Fatoh6/vlyhr`

`STRIPE_SECRET_KEY`=`sk_test_51RlsgVR0RiESnN3nKU1rfe0ax05DdaIa5RdidxyTd4TG002GyaXACniMdsXSGeu22RY3yPHmozeOxk9qwDURufAS001Ts7nepf`
`STRIPE_WEBHOOK_SECRET`=`whsec_AR4M2qL8sqE84Yge5XAVSAa1L8Y8hUH8`

`process.env.EMAIL_USER`: `Your Email`
`process.env.EMAIL_PASS`: `Your Password Code`

To run this project, you will need to add the following environment variables to your .env file
in **Client Side**

`NEXT_PUBLIC_API_URL`=`http://localhost:5000`
`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`=`pk_test_51RlsgVR0RiESnN3n7nPYgtvFHEMyJpdOMA9OMSEH0ZRPib7yQCUsud3umxkDNMoLW3hrb3uImjE0anC7851oivym00AsEMhmdD`


## License

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)



<h1>Sistema de registro bibliotecario <h1/>

<p align="center">
  <img src="./Book-Logo-PNG-Photos.png" width="250" alt="Library Logo" />
</p>

## Descripcion

Creado con el objetivo de lograr la optimización del trabajo de registro y seguimiento de préstamos bibliográficos, mejorar también el acceso a material de lectura a las personas

Lograr la realización inventario de libros de manera digital para un mejor control de las unidades disponibles y realización de préstamos para su validación por parte del bibliotecario encargado

Proyecto realizado con node 20.11.0, framework nestjs versión 11.0.0 para la parte backend y nextjs versión 15.3.2 para el frontend con apoyo de librerias de shadcn para utilizar componentes e implementarlos facilmente, como base de datos se utiliza postgresql versión 17.4

## Inicializacion del proyecto

Para backend solo es necesario la instalación de los paquetes a través del comando “npm install” realizara la instalación de todos los paquetes de node.module

```bash
$ npm install
```

En la parte de la configuración en este caso se utiliza [postgresql 17](https://www.postgresql.org/download/) para la base de datos 

  La Instalacion de Postgresql Varia Segun SO o distro de Linux que utilize

Para la base de datos se utiliza el archivo de configuración de entorno junto con la clave de acceso para lo que es la autenticación en los procesos que se realizan, contenido del archivo .env se ve reflejado en el template que se muestra entre los archivos:

```bash
  DB_NAME= dbname
  DB_PASSWORD= dbpasswd
  DB_HOST=localhost
  DB_PORT=5432
  DB_USERNAME=postgres

  JWT_SECRET= tujwtsecreto
```


## Iniciar Ejecucion del backend

```bash
$ npm run start:dev
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

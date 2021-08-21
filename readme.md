## AUTHGATOR

Portal de cadastro de usuários.

- MongoDB noSQL database.
- Bcryptjs utilizado para hash de senha.
- Nodemailer em conexão com Mailtrap para envio de emails.
- Envio de token de recuperação de senha para o email.
- Autenticação com JWT(JasonWebToken).


## Create User
![CREATE USER](png/create-user.png)


## Authenticate User
![AUTHENTICATE USER](png/auth-ok.png)



## Forgot Password
![FORGOT PASSWORD](png/send-recover-email.png)



## Getting Recovering Token By Email
![GETTING RECOVERING TOKEN BY EMAIL](png/recover-pass-mailtrap.png)



## Password Reset
![PASSWORD RESET](png/password-reset.png)


# Setup

Requer uma versão do node instalado, preferencialmente node v12+

Instalar as dependencias, subir o ambiente e testar.

### Instalar dependências

```bash
$ npm install
```

### Subir o docker-compose com mongo

```bash
$ docker-compose up
```

#
Backend desenvolvido até o momento, posteriormente será implementado o front utilizando VueJs.
#
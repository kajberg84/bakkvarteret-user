# Search for patries, Kaj Berg

## Create user model

    firstname: string
    lastname: string
    password: string
    email: string
    permissionLevel: Number
    avatar?: string
    dateOfEntry?: Date
    lastUpdated?: Date

## Create image model
    createdBy: user_id
    image: imageUrl
    description: string
    rating: number(1-5)
    storeName: string
    dateOfEntry?: Date
    lastUpdated?: Date

## Login

    email
    password

----

## User Router

get, GET:"/:id"
create, POST: "/"
update, put: "/:id"
delete, delete: "/:id"

## Login Router

login, POST: "/"
response JWT access o refresh token


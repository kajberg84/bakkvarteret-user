// @ts-nocheck
import { Request } from 'express'

export default class HateoasLinks {
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  baseUrl: string

  createLink(user: any, route: string): any {
    console.log('req.query: ', user)

    const links = {
      links: {
        self: {
          href: `${this.baseUrl}/${route}/${user._id}`,
          rel: 'self',
          method: 'GET'
        },
        update: {
          href: `${this.baseUrl}/${route}/${user._id}`,
          rel: 'self',
          method: 'PUT'
        },
        delete: {
          href: `${this.baseUrl}/${route}/${user._id}`,
          rel: 'self',
          method: 'DELETE'
        },
        addFriend: {
          href: `${this.baseUrl}/${route}/${user._id}/add-friend`,
          rel: 'add-friend',
          method: 'PATCH'
        },
        removeFriend: {
          href: `${this.baseUrl}/${route}/${user._id}/remove-friend`,
          rel: 'remove-friend',
          method: 'PATCH'
        }
      }
    }

    const hateoasResponse = {
      ...user._doc,
      ...links
    }

    return hateoasResponse
  }

  createCollectionResponse(users: any, route: string): string {
    //Itterate through the users and add the links to each one
    const hateoasResponse = users.map((user: any) => {
      const links = {
        links: {
          self: {
            href: `${this.baseUrl}/${route}/${user._id}`,
            rel: 'self',
            method: 'GET'
          },
          update: {
            href: `${this.baseUrl}/${route}/${user._id}`,
            rel: 'self',
            method: 'PUT'
          },
          delete: {
            href: `${this.baseUrl}/${route}/${user._id}`,
            rel: 'self',
            method: 'DELETE'
          }
        }
      }
      return {
        ...user._doc,
        ...links
      }
    })

    return hateoasResponse
  }
}

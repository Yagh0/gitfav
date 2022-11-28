import { GithubUser } from "./GithubUser.js"

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()

    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@gitfav')) || []
    }

    save() {
        localStorage.setItem('@gitfav:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {
            const userExists = this.entries.find(entry => entry.login.toUpperCase() === username.toUpperCase())

            if (userExists) {
                throw new Error("Usuário já cadastrado!")
            }

            const user = await GithubUser.search(username)

            if(user.login === undefined) {
                throw new Error("Usuário não encontrado!")
            }

            
            
            this.entries = [user, ...this.entries]

            this.update()
            this.checkEntries()
            this.save()
        } catch(error) {
            alert(error.message)
        }
    }
    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.githubSearch button')
        addButton.onclick = () => {
            const {value} = this.root.querySelector('.githubSearch input')

            this.add(value)
        }
    }

    update() {
        this.removeAllTrs()

        this.entries.forEach((user) => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm("Tem certeza que deseja remover esse usuário?")
                if(isOk) {
                    this.delete(user)
                    this.checkEntries()
                }
            }

            this.tbody.append(row)
            this.checkEntries()
        })
    }

    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
        <td class="user">
            <img src="https://github.com/diego3g.png" alt="Imagem de diego3g">
            <a href="https:://github.com/diego3g" target="_blank">
                <p>Diego Fernandes</p>
                <span>/diego3g</span>
            </a>
        </td>
        <td class="repositories">
            10
        </td>
        <td class="followers">
            20
        </td>
        <td>
            <button class="remove">Remover</button>
        </td>
        `

        return tr
    }

    removeAllTrs() {
        this.tbody.querySelectorAll('tr')
        .forEach((tr) => {
            tr.remove()
        })
    }

    checkEntries() {
        const nothingYet = document.querySelector(".nothingYet")
        if(this.entries.length > 0) {
            nothingYet.classList.add('hide')
        } else {
            nothingYet.classList.remove('hide')
        }
    }
}
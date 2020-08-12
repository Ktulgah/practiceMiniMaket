document.addEventListener(`DOMContentLoaded`, () => {
    document.querySelector(`.search`).addEventListener(`submit`, (event) => {

    })

    class newPaint {
        constructor(id, img, altimg, author, title, price, parentSelector) {
            this.id = id
            this.img = img
            this.altimg = altimg
            this.author = author
            this.title = title
            this.price = price
            this.parentSelector = parentSelector
            this.checkSale()
        }

        checkSale() {
            if (this.price.sale > 0) {
                this.sale = this.price.sale
            }
            this.price = this.price.price

        }

        render() {
            const paintWindow = document.createElement(`div`)
            paintWindow.classList.add(`paintWindow`)
            paintWindow.id = this.id
            paintWindow.innerHTML = `
            <div class = "paint-holder">
            <img src=${this.img} alt=${this.altimg}>
             </div>
             <div class="desc">
               <div class="author">${this.author}</div>
               <div class="paint-name">${this.title}</div>
               <div class="interact">
               <div class="priceBlock">
                <div class="price">${this.price}</div>
                <div class="sale">${this.sale}</div>
                </div>
                <button class="buyButton">Купить</button>
                </div>
                </div>`
            document.querySelector(this.parentSelector).append(paintWindow)
            if (!this.sale) {
                paintWindow.querySelector(`.sale`).remove()
            } else {
                paintWindow.querySelector(`.price`).classList.add(`priceWithSale`)
            }
            if (this.price === 0) {
                paintWindow.querySelector(`.interact`).textContent = `Продано`
            }
            const localBasket = JSON.parse(localStorage.getItem(`basket`)) || []
            if (localBasket.includes(paintWindow.id)) {
                paintWindow.classList.add(`inBasket`)
                toggleBuyButton()
            }


        }
    }

    const getResource = async (url) => {
        const res = await fetch(url);
        return await res.json();
    };
    getResource(`./paintingsDB.json`).then(response => {
        response.paints.forEach(({id, img, altimg, author, title, price}) => {
            new newPaint(
                id,
                img,
                altimg,
                title,
                author,
                price,
                `.paint-wrapper`
            ).render()
        })

    })

    //'Content-Type': 'application/json
    function toggleBuyButton() {
        document.querySelectorAll(`.buyButton`).forEach(elem => {
            elem.innerHTML = `Купить`
        })
        document.querySelectorAll(`.inBasket`).forEach(elem => {
            elem.querySelector(`.buyButton`).innerHTML = `В корзине`
        })
    }

    document.querySelector(`.paint-wrapper`).addEventListener(`click`, (event) => {
        const target = event.target
        if (!target.classList.contains(`buyButton`)) {
            return
        }
        const paint = target.closest(`.paintWindow`)
        let basketPaintsArray = JSON.parse(localStorage.getItem(`basket`)) || []
        paint.classList.toggle(`inBasket`)
        let lul = Array.from(document.querySelectorAll(`.inBasket`))
        if (paint.classList.contains(`inBasket`)) {
            basketPaintsArray.push(paint.id)
        } else {
            basketPaintsArray = lul.map(elem => elem.id)
        }
        toggleBuyButton()
        localStorage.setItem(`basket`, JSON.stringify(basketPaintsArray))
    })
})



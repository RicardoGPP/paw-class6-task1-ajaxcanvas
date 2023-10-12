const model = {
    
    clicking: false,
    mode: 'DRAW',
    images: [],
    selected: null,
    
    isClicking() {
        return this.clicking;
    },
    setClicking(clicking) {
        this.clicking = clicking;
    },
    getMode() {
        return this.mode;
    },
    setMode(mode) {
        this.mode = mode;
    },
    addImage(image) {
        this.images.push(image);
    },
    getImages() {
        return this.images;
    },
    setImages(images) {
        this.images = images;
    },
    deleteImage(id) {
        this.images = this.images.filter(image => image.id != id);
    },
    getSelected() {
        return this.selected;
    },
    setSelected(selected) {
        this.selected = selected;
    }
};

const view = {

    canvasContainer: document.getElementById('canvas-container'),
    canvas: document.getElementById('canvas'),
    ctx: this.canvas.getContext('2d'),
    btnDraw: document.getElementById('btn-draw'),
    btnErase: document.getElementById('btn-erase'),
    btnReset: document.getElementById('btn-reset'),
    btnSave: document.getElementById('btn-save'),
    cards: document.getElementById('images'),
    
    addListeners() {
        this.canvas.addEventListener('mouseleave', () => {
            controller.setClicking(false);
        });

        this.canvas.addEventListener('mousedown', (evt) => {
            controller.setClicking(true);
            controller.setSelected(null);
            controller.draw(this.getCoordinates(evt));
        });
        
        this.canvas.addEventListener('mouseup', () => {
            controller.setClicking(false);
        });
        
        this.canvas.addEventListener('mousemove', (evt) => {
            controller.draw(this.getCoordinates(evt));
        });
        
        this.btnDraw.addEventListener('click', () => {
            controller.setMode('DRAW');
        });
        
        this.btnErase.addEventListener('click', () => {
            controller.setMode('ERASE');
        });
        
        this.btnReset.addEventListener('click', () => {
            view.reset();
        });
        
        this.btnSave.addEventListener('click', () => {
            controller.save(this.canvas.toDataURL());
        });
    },
    updateCanvas() {
        let width = this.canvasContainer.clientWidth - 30;
        if (this.canvas.width != width) {
            this.canvas.width = width;
            this.canvas.height = width / 2;
        }
        setTimeout(() => this.updateCanvas(), 0);
    },
    updateOperations(mode) {
        let btnToHighlight = this.btnDraw;
        let btnToUnhighlight = this.btnErase;
        
        if (mode == 'ERASE') {
            btnToHighlight = this.btnErase;
            btnToUnhighlight = this.btnDraw;
        }

        const highlightClass = 'btn-primary';
        const unhighlightClass = 'btn-secondary';

        btnToHighlight.classList.add(highlightClass);
        btnToHighlight.classList.remove(unhighlightClass);
        btnToUnhighlight.classList.add(unhighlightClass);
        btnToUnhighlight.classList.remove(highlightClass);
    },
    updateCards(images, selected) {
        this.cards.innerHTML = '';
        images.forEach(image => this.cards.appendChild(this.getCard(image, selected)));
    },
    getCard(image, selected) {
        const img = document.createElement('img');
        img.classList.add('card-img-top');
        img.classList.add('border-bottom');
        img.src = image.dataurl;

        const btnSelect = document.createElement('a');
        btnSelect.classList.add('btn');
        btnSelect.classList.add('btn-primary');
        btnSelect.classList.add('mr-2');
        btnSelect.classList.add('float-right');
        btnSelect.href = '#';
        btnSelect.textContent = 'Selecionar';
        btnSelect.addEventListener('click', () => {
            controller.setSelected(image)
        });

        const btnRemove = document.createElement('a');
        btnRemove.classList.add('btn');
        btnRemove.classList.add('btn-danger');
        btnRemove.classList.add('float-right');
        btnRemove.href = '#';
        btnRemove.textContent = 'Remover';
        btnRemove.addEventListener('click', (event) => {
            event.preventDefault();
            controller.delete(image.id);
        });

        const body = document.createElement('div');
        body.classList.add('card-body');
        body.appendChild(btnRemove);
        body.appendChild(btnSelect);

        const card = document.createElement('div');
        card.classList.add('card');
        card.classList.add('col-lg-4');
        card.classList.add('col-md-6');
        card.classList.add('col-sm-12');
        card.classList.add('p-0');
        if (selected && selected.id == image.id) {
            card.classList.add('border');
            card.classList.add('border-primary');
        }

        card.appendChild(img);
        card.appendChild(body);

        return card;
    },
    draw(x, y, mode) {
        this.ctx.beginPath();
        this.ctx.fillStyle = mode == 'DRAW' ? 'black' : 'white';
        this.ctx.arc(x, y, 10, 0, 2 * Math.PI);
        this.ctx.fill();
    },
    reset() {
        this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    },
    load(dataurl) {
        this.reset();
        let img = new Image();
        img.setAttribute('src', dataurl);
        this.ctx.drawImage(img, 0, 0);
    },
    getCoordinates(evt) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }
};

const controller = {
    
    service: new Service(),
    
    init() {
        view.addListeners();
        view.updateCanvas();
        this.service.getAll()
            .then(images => model.setImages(images))
            .then(() => view.updateCards(model.getImages(), model.getSelected()));
    },
    setSelected(selected) {
        model.setSelected(selected);
        if (selected) {
            view.load(selected.dataurl);
        }
        view.updateCards(model.getImages(), model.getSelected());
    },
    setClicking(clicking) {
        model.setClicking(clicking);
    },
    setMode(mode) {
        model.setMode(mode);
        view.updateOperations(model.getMode());
    },
    draw({x, y}) {
        if (model.isClicking()) {
            view.draw(x, y, model.getMode());
        }
    },
    save(dataurl) {
        this.service.save(dataurl)
            .then(image => model.addImage(image))
            .then(() => view.updateCards(model.getImages(), model.getSelected()))
            .then(() => view.reset());
    },
    delete(id) {
        this.service.delete(id)
            .then(() => model.deleteImage(id))
            .then(() => view.updateCards(model.getImages(), model.getSelected()));
    }
};

controller.init();
var mainContainer = document.getElementById('media-container');
var state = {};

function removePublicDir(path) {
    alert(path);
    return path.replace('public', '');
}

function byId(id) {
    return document.getElementById(id);
}

function update(element, values) {
    element.innerHTML = values;
}

function updateCount() {
    var data =
        state['count'] +
        ' out ' +
        state['max-count'] +
        ' selected (tap to select/unselect)';
    update(byId('count'), data);
}

function createElement(name, props = null) {
    var ele = document.createElement(name);
    if (props) {
        for (var i in props) {
            ele[i] = props[i];
        }
    }
    return ele;
}

function toggleClass(ele, className, callback) {
    if (className == '') return;
    if (ele.classList.contains(className)) {
        ele.classList.remove(className);
        callback(-1);
        return;
    }
    ele.classList.add(className);
    callback(1);
}

function start() {
    state['count'] = 0;
    state['max-count'] = 0;
    state['max-count'] = images.length;
    updateCount();

    images.forEach(function (element) {
        var media = createElement('div', { className: 'media shadow ' });
        toggleClass(media, element[1], function (c) {
            state['count'] += c;
            updateCount();
        });
        var img = createElement('img', { src: removePublicDir(element[0]) });
        media.addEventListener('click', function (ev) {
            toggleClass(media, 'selected', function (c) {
                state['count'] += c;
                updateCount();
            });
        });
        media.append(img);
        mainContainer.append(media);
        console.log(images);
    });
}

var mainContainer = document.getElementById('media-container');
var state = {};

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

function serialize(obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
    return str.join('&');
}

function post(path, data = {}) {
    var xHttp = new XMLHttpRequest();
    xHttp.onreadystatechange = function (ev) {
        if (this.readyState == 4) {
            if (this.status == 200) {
                alert('Done');
            } else {
                alert('Somthing Went Wrong!');
            }
        }
    };
    xHttp.onerror = () => {
        alert('Something went wrong');
    };
    xHttp.open('POST', path, true);
    xHttp.send('hello=h');
    console.log(serialize(data));
}

function start() {
    state['count'] = 0;
    state['max-count'] = 0;
    state['max-count'] = images.length;
    updateCount();

    images.forEach(function (element) {
        var media = createElement('div', { className: 'media shadow ' });
        toggleClass(media, element.className, function (c) {
            state['count'] += c;
            updateCount();
        });
        var img = createElement('img', {
            src: '/' + element.path,
            name: element.name,
        });
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

    var submitBtn = document.getElementById('bottom-btn');

    submitBtn.onclick = function (ev) {
        ev.preventDefault();
        var ele = document.getElementsByClassName('selected');
        var data = {};
        for (var i = 0; i < ele.length; i++) {
            data[ele[i].querySelector('img').name] = 'selected';
        }
        $.post('/user/submit', jQuery.param(data))
            .done(function () {
                alert('Done');
            })
            .fail(function () {
                alert('Something went wrong');
            });
    };
}

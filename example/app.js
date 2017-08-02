var ListView = require('ti.xaml.listview');
var win = Ti.UI.createWindow({ backgroundColor: 'green', layout: 'vertical' }),
    cmdView = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        layout: 'horizontal',
        backgroundColor: 'gray'
    }),
    goSection0 = Ti.UI.createButton({
        title: 'Section 0'
    }),
    goSection1 = Ti.UI.createButton({
        title: 'Section 1'
    }),
    goSection2 = Ti.UI.createButton({
        title: 'Section 2'
    });

var items0 = [],
    items1 = [],
    items2 = [];

for (var i = 0; i < 20; i++) {
    items0.push({ properties: { title: 'Fruit ' + i, image: 'Square150x150Logo.png' } });
    items1.push({ properties: { title: 'Vegetable ' + i, image: 'Square150x150Logo.png' } });
    items2.push({ properties: { title: 'Meat ' + i, image: 'Square150x150Logo.png' } });
}

var fruitSection = Ti.UI.createListSection({
    headerTitle: 'Fruits',
    items: items0
}),
    vegSection = Ti.UI.createListSection({
        headerTitle: 'Vegetables',
        items: items1
    }),
    meatSecion = Ti.UI.createListSection({
        headerTitle: 'Meats',
        items: items2
    });

var listView = new ListView({
    width: Ti.UI.FILL,
    height: '80%',
    sections: [fruitSection, vegSection, meatSecion]
});

goSection0.addEventListener('click', function () {
    listView.scrollToItem(0, 0);
});
goSection1.addEventListener('click', function () {
    listView.scrollToItem(1, 0);
});
goSection2.addEventListener('click', function () {
    listView.scrollToItem(2, 0);
});

listView.addEventListener('itemclick', function (e) {
    alert(JSON.stringify(e.properties));
});

cmdView.add(goSection0);
cmdView.add(goSection1);
cmdView.add(goSection2);

win.add(cmdView);
win.add(listView);
win.open();

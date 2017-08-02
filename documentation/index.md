# ti.xaml.listview - Lightweight ListView for Windows based on XAML DataTemplate

`ti.xaml.listview` is lightweight ListView implementation that is aiming for better performance and more flexible layout & binding based on [XAML DataTemplate](https://docs.microsoft.com/en-us/uwp/api/windows.ui.xaml.datatemplate). `ti.xaml.listview` acts like lightweight version of `Ti.UI.ListView` with limited functionalities, it borrows some API from `Ti.UI.ListView` so you can use `Ti.UI.ListSection` and `Ti.UI.ListItem` with it.

**Key differences between `Ti.UI.ListView`**

Some properties around bindings and layouts are not supported. Use [XAML DataTemplate](https://docs.microsoft.com/en-us/uwp/api/windows.ui.xaml.datatemplate) in `Resource/ListViewItemTemplate.xaml` instead.

- `templates` property (ListView custom item template) is not supported. 
- `headerView`, `headerTitle`, `footerView` and `footerTitle` are not supported.

## How to Build

Update `WINDOWS_SRC_DIR` variable in [windows/CMakeLists.txt](windows/CMakeLists.txt) to point to Titanium SDK path that you are going to use.

```
set(WINDOWS_SOURCE_DIR "C:/ProgramData/Titanium/mobilesdk/win32/6.2.0.v20170727074842/windows")
```

Then go to `windows` folder, build it using `appc ti build`.

```
> cd windows
> appc ti build -p windows --build-only --run-cmake -l trace
```

## ListView sections with header

```js
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
```

### Resource/ListViewItemTemplate.xaml

`defaultItemTemplate` is the template for ListView items. `defaultItemTemplateGroupStyle` is the template for section headers.

```xml
<ResourceDictionary
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" 
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">

    <DataTemplate x:Key="defaultItemTemplate">
        <Grid Height="60" Margin="6">
            <Grid.ColumnDefinitions>
                <ColumnDefinition Width="Auto"/>
                <ColumnDefinition Width="*"/>
            </Grid.ColumnDefinitions>
            <Border Background="{StaticResource ListViewItemPlaceholderBackgroundThemeBrush}" Width="54" Height="54">
                <Image Source="{Binding Image}" Stretch="UniformToFill"/>
            </Border>
            <StackPanel Grid.Column="1" VerticalAlignment="Top" Margin="10,0,0,0">
                <TextBlock Text="{Binding Title}" TextWrapping="NoWrap"/>
                <TextBlock Text="{Binding Subtitle}" TextWrapping="NoWrap"/>
                <TextBlock Text="{Binding Description}" MaxHeight="54"/>
            </StackPanel>
        </Grid>
    </DataTemplate>

    <GroupStyle x:Key="defaultItemTemplateGroupStyle">
        <GroupStyle.HeaderTemplate>
            <DataTemplate>
                <TextBlock
                    Text="{Binding Title}"
                    FontSize="40" />
            </DataTemplate>
        </GroupStyle.HeaderTemplate>
    </GroupStyle>

</ResourceDictionary>
```

## ListView without sections

```js
var ListView = require('ti.xaml.listview');
var win = Ti.UI.createWindow({ backgroundColor: 'green', layout: 'vertical' });

var items0 = [];
for (var i = 0; i < 50; i++) {
    items0.push({ properties: { title: 'Fruit ' + i, image: 'Square150x150Logo.png' } });
}

var listView = new ListView({
    width: Ti.UI.FILL,
    height: Ti.UI.FILL,
    sections: [Ti.UI.createListSection({items: items0})]
});

listView.addEventListener('itemclick', function (e) {
    alert(JSON.stringify(e.properties));
});

win.add(listView);
win.open();
```

### Resource/ListViewItemTemplate.xaml

Note that when you remove `defaultItemTemplateGroupStyle` from template, section header is not displayed.

```xml
<ResourceDictionary
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" 
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">

    <DataTemplate x:Key="defaultItemTemplate">
        <Grid Height="60" Margin="6">
            <Grid.ColumnDefinitions>
                <ColumnDefinition Width="Auto"/>
                <ColumnDefinition Width="*"/>
            </Grid.ColumnDefinitions>
            <Border Background="{StaticResource ListViewItemPlaceholderBackgroundThemeBrush}" Width="54" Height="54">
                <Image Source="{Binding Image}" Stretch="UniformToFill"/>
            </Border>
            <StackPanel Grid.Column="1" VerticalAlignment="Top" Margin="10,0,0,0">
                <TextBlock Text="{Binding Title}" TextWrapping="NoWrap"/>
                <TextBlock Text="{Binding Subtitle}" TextWrapping="NoWrap"/>
                <TextBlock Text="{Binding Description}" MaxHeight="54"/>
            </StackPanel>
        </Grid>
    </DataTemplate>
    
</ResourceDictionary>
```

## Creating a List

To create a ListView object, pass an array of ListDataItem objects to the list section's items property, which creates and adds each array element as a row to a single ListSection. Use the ListView's sections property to add the section(s) to the list view. This should be pretty much similar to list creation with `Ti.UI.ListView`.

```js
var items0 = [];
for (var i = 0; i < 50; i++) {
    items0.push({ properties: { title: 'Fruit ' + i, image: 'Square150x150Logo.png' } });
}
var section = Ti.UI.createListSection({items: items0});
var listView = new ListView({
    sections: [section]
});
```


## itemclick event

Due to internal implementation aiming for better performance, `itemclick` event no longer returns item index. It simply returns `properties` values that the ListDataItem object has.

```js
var items0 = [];
for (var i = 0; i < 50; i++) {
    items0.push({ properties: { title: 'Fruit ' + i, image: 'Square150x150Logo.png' } });
}
var section = Ti.UI.createListSection({items: items0});
var listView = new ListView({
    sections: [section]
});

listView.addEventListener('itemclick', function (e) {
    //
    // itemclick event simply returns ListDataItem properties value such as
    // { title: 'Fruit 0', image: 'Square150x150Logo.png' }
    //
    alert(JSON.stringify(e.properties));
});
```

## Customizing List Items


To create custom DataTemplate, you need to define bindings. Bindings can be defined when you create list view items using ListDataItem's property. Let say you have following item definition:

```js
var item = {
	properties: { title: 'Apple', image: 'Apple.png' }
};
```

Then the simplest `DataTemplate` for ListView would look like below.

```xml
<DataTemplate x:Key="defaultItemTemplate">
    <Image Source="{Binding Image}"/>
    <TextBlock Text="{Binding Title}"/>
</DataTemplate>
```

As you can see when you want to bind the ListDataItem's `title` property with XAML TextBox text, use `<TextBox>` component with `{Binding Title}`. You might notice that the property name and XAML binding name matches case insensitive.

```xml
<TextBlock Text="{Binding Title}"/>
```

On runtime, XAML DataTemplate mechanics replaces the text `{Binding Title}` with `Apple` in this case.

```xml
<TextBlock Text="Apple"/>
```

Similarly, when you want to deal with image data, you can use `<Image>` component then. It would look like below;

```xml
<Image Source="{Binding Image}"/>
```

On runtime, XAML DataTemplate mechanics replaces the text `{Binding Image}` with `'Apple.png` in this case.

```xml
<Image Source="Apple.png"/>
```

For more details about customizing ListView items with XAML, please refer to [XAML DataTemplate](https://docs.microsoft.com/en-us/uwp/api/windows.ui.xaml.datatemplate).


### Supported binding names

Due to internal binding implementation, only following property names are supported in order to bind with XAML DataTemplate. Note that all property names are case insensitive.

|        |       |      |    |   |
| ------ |-------| -----| ---|---|
| data  | name  | title |first |middle | 
| last | id | text |image |subtitle |
| description | street | city |state |postcode |
| email | username |  || |
| data0 | data1 | data2 |data3 |data4 |
| data5 | data6 | data7 |data8 |data9 |


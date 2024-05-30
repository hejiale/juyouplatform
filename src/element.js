import Vue from 'vue'
import './assets/styles/element-variables.sass'

import {
  Container,
  Header,
  Aside,
  Main,
  Badge,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Checkbox,
  CheckboxGroup,
  CheckboxButton,
  Image,
  Col,
  DatePicker,
  Dialog,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Empty,
  Form,
  FormItem,
  Input,
  Loading,
  Menu,
  MenuItem,
  MenuItemGroup,
  Message,
  MessageBox,
  Notification,
  Option,
  Pagination,
  Row,
  Scrollbar,
  Select,
  Submenu,
  Table,
  TableColumn,
  TabPane,
  Tabs,
  Tree,
  Upload,
  RadioGroup,
  Radio,
  RadioButton,
  Popover,
  Timeline,
  TimelineItem,
  TimePicker,
  Tooltip,
  Progress,
  Switch,
  Link,
  Drawer,
  InputNumber,
  Cascader,
  Transfer,
  Rate,
  Tag,
  TimeSelect,
  Carousel,
  CarouselItem,
  Collapse,
  CollapseItem
} from 'element-ui'

Vue.use(Button)
  .use(Collapse)
  .use(CollapseItem)
  .use(Container)
  .use(CarouselItem)
  .use(TimeSelect)
  .use(Carousel)
  .use(Tag)
  .use(Header)
  .use(Aside)
  .use(Main)
  .use(Badge)
  .use(Form)
  .use(Image)
  .use(FormItem)
  .use(Input)
  .use(Scrollbar)
  .use(Row)
  .use(Card)
  .use(Col)
  .use(Select)
  .use(Option)
  .use(Table)
  .use(TableColumn)
  .use(Menu)
  .use(MenuItemGroup)
  .use(MenuItem)
  .use(Submenu)
  .use(Pagination)
  .use(Tabs)
  .use(TabPane)
  .use(Tree)
  .use(Dropdown)
  .use(DropdownMenu)
  .use(DropdownItem)
  .use(Upload)
  .use(CheckboxGroup)
  .use(CheckboxButton)
  .use(Checkbox)
  .use(Dialog)
  .use(DatePicker)
  .use(RadioGroup)
  .use(Radio)
  .use(RadioButton)
  .use(Popover)
  .use(Breadcrumb)
  .use(BreadcrumbItem)
  .use(Timeline)
  .use(TimelineItem)
  .use(Tooltip)
  .use(Progress)
  .use(TimePicker)
  .use(Drawer)
  .use(Switch)
  .use(Link)
  .use(InputNumber)
  .use(Cascader)
  .use(Transfer)
  .use(Rate)
  .use(Empty)

Vue.prototype.$loading = Loading.service
Vue.prototype.$message = Message
Vue.prototype.$notify = Notification
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$confirm = MessageBox.confirm

Vue.use(Loading.directive)

let loading = null
Vue.prototype.$warning = message => {
  return MessageBox.confirm(message, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
}
let messageBoxLoading = null
Vue.prototype.$openMessageBoxLoading = text => {
  messageBoxLoading = Loading.service({
    target: '.el-message-box',
    text
  })
}
Vue.prototype.$closeMessageBoxLoading = () => {
  messageBoxLoading.close()
}

let layoutViewLoading = null
Vue.prototype.$openLayoutViewLoading = (text = '数据加载中...') => {
  layoutViewLoading = Loading.service({
    target: '.layout-view',
    text
  })
}
Vue.prototype.$closeLayoutViewLoading = () => {
  layoutViewLoading.close()
}

Vue.prototype.$layoutRouterLoading = isOpen => {
  if (isOpen) {
    loading = Loading.service({
      target: '.layout__router',
      text: '数据加载中...'
    })
  } else {
    loading.close()
  }
}

Vue.prototype.$viewImage = url => {
  if (!url) {
    return Notification.error({
      title: '错误',
      message: '未找到图片'
    })
  }
  const h = Vue.prototype.$h
  MessageBox({
    title: '',
    showCancelButton: false,
    showConfirmButton: false,
    showClose: false,
    customClass: 'img-msg-box',
    message: h('img', {
      attrs: {
        src: url,
        style: 'width: 100%'
      }
    })
  }).catch(e => {})
}
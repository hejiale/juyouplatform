<template>
  <div class="tinymce-editor" v-if="isShow">
    <editor
      v-model="myValue"
      :init="init"
      :disabled="disabled"
      @onClick="onClick"
    >
    </editor>
  </div>
</template>
<script>
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/skins/ui/oxide/skin.css";
import "tinymce/icons/default";
import "tinymce/themes/silver";
// 编辑器插件plugins
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import "tinymce/plugins/image"; // 插入上传图片插件
// import 'tinymce/plugins/media' // 插入视频插件
import "tinymce/plugins/table"; // 插入表格插件
import "tinymce/plugins/lists"; // 列表插件
import "tinymce/plugins/wordcount"; // 字数统计插件
import "tinymce/plugins/link"; // 添加一个连接.
import "tinymce/plugins/searchreplace"; // 打开搜索和替换对话框
import "tinymce/plugins/visualchars"; // 隐藏字符串开关.
import "tinymce/plugins/visualblocks"; // 隐藏块级区域开关
import "tinymce/plugins/spellchecker"; // 拼写检查开关
import "tinymce/plugins/preview"; // 预览
import "tinymce/plugins/fullscreen"; // 全屏
import "tinymce/plugins/code"; // 源码预览
import "tinymce/plugins/charmap"; // 开启字符映射表
import "tinymce/plugins/hr"; // 开启字符映射表
import "tinymce/plugins/codesample"; //
import "tinymce/plugins/pagebreak"; //
import "tinymce/plugins/nonbreaking"; //
import "tinymce/plugins/anchor"; //
import "tinymce/plugins/paste"; //
import "tinymce/plugins/insertdatetime"; //
import "tinymce/plugins/print"; //
import "tinymce/plugins/autolink"; //
import "tinymce/plugins/directionality"; //
import "tinymce/plugins/advlist"; //
import "tinymce/plugins/imagetools"; //
import "tinymce/plugins/textpattern"; //
import "tinymce/plugins/template"; //
import "tinymce/plugins/help"; //
import "tinymce/plugins/autoresize"; //

export default {
  components: {
    Editor,
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    plugins: {
      type: [String, Array],
      default:
        "lists advlist image media table wordcount link searchreplace visualchars visualblocks preview fullscreen code charmap hr pagebreak nonbreaking anchor insertdatetime powerpaste indent2em ax_wordlimit lineheight",
    },
    toolbar: {
      type: [String, Array],
      default: `alignleft aligncenter alignright alignjustify | bold fontsize numlist bullist preview hr paste code undo redo fullscreen image`,
    },
    height: {
      default: 500,
    }
  },
  data(vm) {
    return {
      init: {
        // content_style: "div {font-size:14px;font-famliy: 微软雅黑;}",
        language_url: `tinymce/langs/zh_CN.js`,
        language: "zh_CN",
        skin_url: `tinymce/skins/ui/oxide`,
        content_css: `tinymce/skins/content/default/content.css`,
        plugins: vm.plugins,
        toolbar: vm.toolbar,
        min_height: 300 || vm.height,
        max_height: 600 || vm.height,
        toolbar_mode: "sliding", // 工具栏模式——floating / sliding / scrolling / wrap
        end_container_on_empty_block: true,
        powerpaste_word_import: "merge",
        powerpaste_html_import: "merge",
        powerpaste_allow_local_images: true,
        paste_data_images: true,
        branding: false,
        convert_urls: false, // 取消强转相对路径
        default_link_target: "_blank",
        // ax_wordlimit_num: 5000,
        // ax_wordlimit_callback: function (editor, txt, num) {
        //   vm.$message.error('字数超出限制')
        //   return false
        // },
        selector: "textarea", // change this value according to your HTML
        // toolbar: "fontsizeselect",
        fontsize_formats: "11px 12px 14px 16px 18px 24px 36px 48px",
        // 启用菜单栏并显示如下项 [文件 编辑 插入 格式 表格]
        menubar: 'edit insert view format table tools',
        // menubar: false, // 是否显示工具栏
        statusbar: false, // 是否显示底部栏
        // 配置每个菜单栏的子菜单项（如下是默认配置）
        menu: {
          // file: {title: 'File', items: 'newdocument'},
          // file: { title: 'File', items: 'newdocument restoredraft | preview | print ' },
          edit: {
            title: "Edit",
            items: "undo redo | cut copy paste | selectall | searchreplace",
          },
          view: {
            title: "View",
            items:
              "code | visualaid visualchars visualblocks | preview fullscreen",
          },
          insert: {
            title: "Insert",
            items:
              "image link media template codesample inserttable | charmap hr | pagebreak nonbreaking anchor | insertdatetime",
          },
          format: {
            title: "Format",
            items:
              "bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align | forecolor backcolor | removeformat",
          },
          tools: { title: "Tools", items: "code wordcount" },
          // table: {
          //   title: "Table",
          //   items: "inserttable tableprops deletetable row column cell",
          // },
          help: { title: "Help", items: "help" },
        },
        lineheight_val: "0.5 0.75 1 1.2 1.5 1.75 1.8 2 2.5 3 4 5",
        external_plugins: {
          powerpaste: `tinymce/plugins/powerpaste/plugin.min.js`,
          ax_wordlimit: `tinymce/plugins/ax_wordlimit/plugin.min.js`,
          indent2em: `tinymce/plugins/indent2em/plugin.min.js`,
          lineheight: `tinymce/plugins/lineheight/plugin.min.js`,
          media: `tinymce/plugins/media/plugin.js`,
        },
        // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: async (blobInfo, success, failure) => {
          let formData = new FormData();
          formData.append("file", blobInfo.blob(), blobInfo.filename());
          vm.$api
            .fileUploadUpload(formData)
            .then((res) => {
              success(res.fileUrl);
            })
            .catch((e) => {
              failure("请重新上传");
            });
        },
      },
      myValue: vm.value,
      baseUrl: "public",
      isShow: false
    };
  },
  mounted(){
    this.isShow =true;
    tinymce.init({
      external_plugins: {
        powerpaste: `${this.baseUrl}/tinymce/plugins/powerpaste/plugin.min.js`,
      },
    });
  },
  activated() {
    this.isShow = true;
    tinymce.init({
      external_plugins: {
        powerpaste: `${this.baseUrl}/tinymce/plugins/powerpaste/plugin.min.js`,
      },
    });
  },
  deactivated(){
    this.isShow = false;
  },
  methods: {
    // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    // 需要什么事件可以自己增加
    onClick(e) {
      this.$emit("onClick", e, tinymce);
    },
    // 可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.myValue = "";
    },
    calculationText(value) {
      this.myValue = value;
      let activeEditor = tinymce.activeEditor;
      let text = activeEditor.getContent({ format: "text" });
      return text;
    },
  },
  watch: {
    value(newValue) {
      this.myValue = newValue;
    },
    myValue(newValue) {
      let activeEditor = tinymce.activeEditor;
      let text = activeEditor.getContent({ format: "text" });
      this.$emit("input", newValue, text);
    },
  },
};
</script>
<style lang="sass">
.tox-navobj
  iframe
    width: 100% !important
    height: 100% !important
    min-height: 210px !important
</style>

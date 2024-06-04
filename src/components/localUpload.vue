<!-- <template>
  <div class="local-upload">
    <div>
      请先
      <a href="/excel/学生信息模版.xlsx" target="_blank">下载导入模板</a>
      <span style="margin-right: 6px">填充完学生信息，再</span>
    </div>
    <a-upload ref="upload" :accept="accept" :fileList="fileList" :beforeUpload="beforeUpload" style="flex: 1" :remove="removeFile">
      <a-button icon="upload" type="primary">点击上传</a-button>
    </a-upload>
  </div>
</template>

<script>
const getRowHeaderByIndex = (index) => {
  // 表格头为A-Z 然后AA-AZ, BA-BZ。。。
  if (index > 25) {
    const firstLetter = parseInt(index / 26, 10) - 1;
    return `${String.fromCharCode(65 + firstLetter)}${String.fromCharCode(65 + (index % 26))}`;
  }
  return String.fromCharCode(65 + index);
};
const getIsEndLine = (worksheet, rowIndex) => {
  return worksheet[`A${rowIndex}`] || worksheet[`B${rowIndex}`];
};
export default {
  props: {
    // [{ key: '', label: '' }]
    // 顺序保持和导入模板的列顺序一致
    columns: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Object,
      default: () => ({}),
    },
    // 针对某些模板，第一列为表格说明，不为列字段。
    dataStartRowIndexKey: {
      type: String,
    },
    accept: {
      type: String,
      default: '.csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
    },
    isOnlyFile: {
      type: Boolean,
      default: false,
    },
    getEndLineRule: {
      type: Function,
      default: getIsEndLine,
    },
  },
  computed: {
    fileList() {
      if (!this.value || !this.value.file) return [];
      return [this.value.file];
    },
  },
  methods: {
    beforeUpload(file) {
      if (this.isOnlyFile) {
        this.$emit('change', { file, data: [] });
        return false;
      }
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        this.getExcelData(workbook, file);
      };
      fileReader.readAsArrayBuffer(file);
      return false;
    },
    removeFile() {
      this.$emit('change', {});
      return true;
    },
    getExcelData(workbook, file) {
      // columns-> {A: this.columns[0].key, B: this.columns[1].key,...}
      const columns = _(this.columns)
        .map((item, index) => [getRowHeaderByIndex(index), item.key])
        .fromPairs()
        .value();
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      let rowIndex = 2;
      if (this.dataStartRowIndexKey) {
        // 检查第一列前20行，找出匹配列
        for (let i = 1; i < 11; i++) {
          const { v: rawValue } = worksheet[`A${i}`] || {};
          if (rawValue === this.dataStartRowIndexKey) {
            rowIndex = i + 1;
            break;
          }
        }
      }
      const uploadData = [];
      // TODO: 暂时先检验第1列和第2列数据
      // TODO: 没有做表头校验，不按模版可以通过校验
      while (this.getEndLineRule(worksheet, rowIndex)) {
        const row = {}; // excel导入的行均为新增,加上时间戳
        Object.keys(columns).forEach((column) => {
          // 每一列对应的字段key
          const dataKey = columns[column];
          // excel中每个单元格的值;
          // v:rawValue, t: type数据类型，w: formattext，z: number format
          const { v: rawValue, w: formatText } = worksheet[`${column}${rowIndex}`] || {};
          let value = formatText || rawValue;
          if (value) {
            value = value.replace(/(^[\r\n\t\s]*)|([\r\n\t\s]*$)/g, '');
          }
          row[dataKey] = value;
        });
        if (_.compact(Object.values(row)).length > 0) {
          uploadData.push(row);
        }
        rowIndex += 1;
      }
      this.$emit('change', { file, data: uploadData });
    },
  },
};
</script>

<style lang="less" scoped>
.local-upload {
  display: flex;
  flex-direction: column;
}
</style> -->

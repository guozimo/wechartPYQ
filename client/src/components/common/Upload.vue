<template>
    <div class="img_wrap">
        <div class="isImg" v-if="showFileData.length > 0" v-for="(file_img,index) in showFileData" :key="index">
            <img :src="file_img" alt="" />
            <button class="remove" @click="removeImg(file_img)">x</button>
        </div>
        <div class="isImg img_upload" v-if="showFileData.length < 9">
            <button class="btn_upload">
                <input @change="addFile" type="file" ref="myFile" multiple="multiple" accept="img/*" />
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'upload',
    data() {
        return {
            showFileData: [],//存放图片url的数组，用于本地展示
            allUploadFiles: []//文件上传file的数组
        }
    },
    methods: {
        addFile() {
            // console.log(this.$refs.myFile.files);
            let files = [...this.$refs.myFile.files];
            
            if (this.showFileData.length + files.length > 9) {
                alert('最多发表9张图片');
                return;
            }

            files.forEach(file => {
                this.allUploadFiles.push(file);
                let objUrl = this.getObjectURL(file);
                this.showFileData.push(objUrl);
            });

            //注册事件，让调用方执行
            this.$emit("getImd",this.allUploadFiles);
        },
        getObjectURL(file) {
            let url = null;
		    if(window.createObjectURL!=undefined){ // basic  
		        url=window.createObjectURL(file);
		    }else if(window.URL!=undefined){ // mozilla(firefox)  
		        url=window.URL.createObjectURL(file);
		    } else if(window.webkitURL!=undefined){ // webkit or chrome  
		        url=window.webkitURL.createObjectURL(file);
		    }  
		    return url;
        },
        removeImg(file_img) {
            this.showFileData.forEach((file,index) => {
                if (file == file_img) {
                    this.showFileData.splice(index,1);
                }
            })
        }
    }
}
</script>

<style scoped>
.isImg {
  box-sizing: border-box;
  width: 30%;
  height: 6rem;
  float: left;
  margin-right: 8px;
  margin-bottom: 8px;
  position: relative;
}
.btn_upload {
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  background: url(../../assets/upload.png) no-repeat;
  background-size: 100% 100%;
}
.btn_upload input {
  display: inline-block;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.isImg img {
  width: 100%;
  height: 100%;
}

.isImg .remove {
  position: absolute;
  top: -8px;
  right: -5px;
  border: none;
  outline: none;
  width: 20px;
  height: 20px;
  padding: 0;
  text-align: center;
  color: white;
  background-color: #3baffd;
  line-height: 10px;
  border-radius: 50%;
}
</style>

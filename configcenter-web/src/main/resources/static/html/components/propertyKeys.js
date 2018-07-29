const propertyKeysComponentTemplate = `
<div>
    <el-row>
        <el-col style="text-align: right;margin-bottom: 30px">
            <span>环境：</span>
            <router-link v-for="profile in allProfiles" :to="'/configs/' + appId + '/' + profile.profileId" :key="profile.profileId" style="margin-right: 10px">
                <el-button type="text">{{ profile.profileId }}</el-button>
            </router-link>
        </el-col>
    </el-row>
    <div v-for="appPropertyKeys in appPropertyKeyses" style="margin-bottom: 50px">
        <el-row v-if="appPropertyKeys.appId === appId">
            <el-col :span="7">
                <div style="margin-bottom: 5px">
                    <el-button type="primary" icon="el-icon-plus" @click="addPropertyKeyVisible = true" size="small">新增配置项</el-button>
                </div>
            </el-col>
            <el-col :span="10" style="text-align: center;margin-bottom: 10px">
                <span style="font-size: x-large;color: #409EFF;">{{ toShowingApp(appPropertyKeys.app) }}</span>
            </el-col>
        </el-row>
        <el-row v-else>
            <el-col :offset="7" :span="10" style="text-align: center;margin-bottom: 10px">
                <span style="font-size: large;color: #67c23a;">{{ toShowingApp(appPropertyKeys.app) }}</span>
            </el-col>
        </el-row>
        <el-table :data="appPropertyKeys.propertyKeys" v-loading="appPropertyKeysesLoading" :key="appPropertyKeys.appId" border stripe>
            <el-table-column prop="key" label="属性key"></el-table-column>
            <el-table-column label="备注">
                <template slot-scope="{ row }">
                    <span v-if="!row.editing">{{ row.memo }}</span>
                    <el-input v-else v-model="row.editingMemo" size="small" clearable placeholder="请输入备注"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="作用域" width="160px">
                <template slot-scope="{ row }">
                    <div v-if="!row.editing">
                        <el-tag v-if="row.scope === 'PRIVATE'">私有</el-tag>
                        <el-tag v-else-if="row.scope === 'PROTECTED'" type="success">可继承</el-tag>
                        <el-tag v-else-if="row.scope === 'PUBLIC'" type="warning">公开</el-tag>
                    </div>
                    <el-select v-else v-model="row.editingScope" size="small" placeholder="请选择作用域" style="width: 90%">
                        <el-option value="PRIVATE" label="私有"></el-option>
                        <el-option value="PROTECTED" label="可继承"></el-option>
                        <el-option value="PUBLIC" label="公开"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column v-if="appPropertyKeys.appId === appId" label="操作" header-align="center" width="160px">
                <template slot-scope="{ row }">
                    <el-row>
                        <el-col :span="12" style="text-align: center">
                            <el-tooltip v-if="!row.editing" content="修改" placement="top" :open-delay="1000" :hide-after="3000">
                                <el-button @click="startEditing(row)" type="primary" icon="el-icon-edit" size="small" circle></el-button>
                            </el-tooltip>
                            <template v-else>
                                <el-button-group>
                                    <el-tooltip content="取消修改" placement="top" :open-delay="1000" :hide-after="3000">
                                        <el-button @click="row.editing = false" type="info" icon="el-icon-close" size="small" circle></el-button>
                                    </el-tooltip>
                                    <el-popover placement="top" v-model="row.savePopoverShowing">
                                        <p>确定保存修改？</p>
                                        <div style="text-align: right; margin: 0">
                                            <el-button size="mini" type="text" @click="row.savePopoverShowing = false">取消</el-button>
                                            <el-button type="primary" size="mini" @click="saveEditing(row)">确定</el-button>
                                        </div>
                                        <el-tooltip slot="reference" :disabled="row.savePopoverShowing" content="保存修改" placement="top" :open-delay="1000" :hide-after="3000">
                                            <el-button @click="row.savePopoverShowing = true" type="success" icon="el-icon-check" size="small" circle></el-button>
                                        </el-tooltip>
                                    </el-popover>
                                </el-button-group>
                            </template>
                        </el-col>
                        <el-col :span="12" style="text-align: center">
                            <el-tooltip content="删除" placement="top" :open-delay="1000" :hide-after="3000">
                                <el-button @click="deletePropertyKey(row)" type="danger" icon="el-icon-delete" size="small" circle></el-button>
                            </el-tooltip>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <el-dialog :visible.sync="addPropertyKeyVisible" :before-close="closeAddPropertyKeyDialog" title="新增配置项" width="40%">
        <el-form ref="addPropertyKeyForm" :model="addPropertyKeyForm" label-width="20%">
            <el-form-item label="配置key" prop="key" :rules="[{required:true, message:'请输入配置key', trigger:'blur'}]">
                <el-input v-model="addPropertyKeyForm.key" clearable placeholder="请输入配置key" style="width: 90%"></el-input>
            </el-form-item>
            <el-form-item label="作用域" prop="scope" :rules="[{required:true, message:'请选择作用域', trigger:'blur'}]">
                <el-select v-model="addPropertyKeyForm.scope" clearable placeholder="请选择作用域" style="width: 90%">
                    <el-option value="PRIVATE" label="私有"></el-option>
                    <el-option value="PROTECTED" label="可继承"></el-option>
                    <el-option value="PUBLIC" label="公开"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="addPropertyKeyForm.memo" clearable placeholder="请输入备注" style="width: 90%"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="closeAddPropertyKeyDialog">取消</el-button>
            <el-button type="primary" @click="addPropertyKey">提交</el-button>
        </div>
    </el-dialog>
</div>
`;

const propertyKeysComponent = {
    template: propertyKeysComponentTemplate,
    props: ['appId'],
    data: function () {
        return {
            allProfiles: [],
            appPropertyKeysesLoading: false,
            appPropertyKeyses: [],
            addPropertyKeyVisible: false,
            addPropertyKeyForm: {
                key: null,
                scope: null,
                memo: null
            }
        };
    },
    mounted: function () {
        this.findAllProfiles();
        this.findAppPropertyKeyses();
    },
    methods: {
        findAllProfiles: function () {
            const theThis = this;
            axios.get('../manage/profile/findAllProfiles')
                .then(function (result) {
                    if (!result.success) {
                        Vue.prototype.$message.error(result.message);
                        return;
                    }
                    theThis.allProfiles = result.profiles;
                });
        },
        findAppPropertyKeyses: function () {
            const theThis = this;
            this.appPropertyKeysesLoading = true;
            axios.get('../manage/propertyKey/findInheritedPropertyKeys', {
                params: {
                    appId: this.appId
                }
            }).then(function (result) {
                theThis.appPropertyKeysesLoading = false;
                if (!result.success) {
                    Vue.prototype.$message.error(result.message);
                    return;
                }
                theThis.appPropertyKeyses = result.appPropertyKeyses;
                theThis.appPropertyKeyses.forEach(function (appPropertyKeys) {
                    appPropertyKeys.propertyKeys.forEach(function (propertyKey) {
                        Vue.set(propertyKey, 'editing', false);
                        Vue.set(propertyKey, 'editingScope', null);
                        Vue.set(propertyKey, 'editingMemo', null);
                        Vue.set(propertyKey, 'savePopoverShowing', false);
                    });
                    Vue.set(appPropertyKeys, 'app', null);
                    axios.get('../manage/app/findApp', {
                        params: {
                            appId: appPropertyKeys.appId
                        }
                    }).then(function (result) {
                        if (!result.success) {
                            Vue.prototype.$message.error(result.message);
                            return;
                        }
                        appPropertyKeys.app = result.app;
                    });
                });
            });
        },
        startEditing: function (propertyKey) {
            propertyKey.editing = true;
            propertyKey.editingScope = propertyKey.scope;
            propertyKey.editingMemo = propertyKey.memo;
        },
        saveEditing: function (propertyKey) {
            propertyKey.savePopoverShowing = false;

            const theThis = this;
            this.doAddOrModifyPropertyKey({
                appId: propertyKey.appId,
                key: propertyKey.key,
                scope: propertyKey.editingScope,
                memo: propertyKey.editingMemo
            }, function () {
                propertyKey.editing = false;
                propertyKey.scope = propertyKey.editingScope;
                propertyKey.memo = propertyKey.editingMemo;
            });
        },
        deletePropertyKey: function (propertyKey) {
            const theThis = this;
            Vue.prototype.$confirm('确定删除配置key？', '警告', {type: 'warning'})
                .then(function () {
                    axios.post('../manage/propertyKey/deletePropertyKey', {
                        appId: propertyKey.appId,
                        key: propertyKey.key
                    }).then(function (result) {
                        if (!result.success) {
                            Vue.prototype.$message.error(result.message);
                            return;
                        }
                        Vue.prototype.$message.success(result.message);
                        theThis.findAppPropertyKeyses();
                    });
                });
        },
        addPropertyKey: function () {
            const theThis = this;
            this.$refs.addPropertyKeyForm.validate(function (valid) {
                if (!valid) {
                    return;
                }
                const params = Object.assign({appId: theThis.appId}, theThis.addPropertyKeyForm);
                theThis.doAddOrModifyPropertyKey(params, function () {
                    theThis.closeAddPropertyKeyDialog();
                    theThis.findAppPropertyKeyses();
                });
            })
        },
        closeAddPropertyKeyDialog: function () {
            this.addPropertyKeyVisible = false;
            this.addPropertyKeyForm.key = null;
            this.addPropertyKeyForm.scope = null;
            this.addPropertyKeyForm.memo = null;
        },
        toShowingApp: function (app) {
            if (!app) {
                return '';
            }
            let text = app.appId;
            if (app.memo) {
                text += '（' + app.memo + '）';
            }
            return text;
        },
        doAddOrModifyPropertyKey: function (params, successCallback) {
            axios.post('../manage/propertyKey/addOrModifyPropertyKey', params)
                .then(function (result) {
                    if (!result.success) {
                        Vue.prototype.$message.error(result.message);
                        return;
                    }
                    Vue.prototype.$message.success(result.message);
                    successCallback();
                });
        }
    }
};
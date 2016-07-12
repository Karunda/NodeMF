/**
 * Created by Godfrey on 6/12/2016.
 */

/**
 * Created by Godfrey on 5/23/2016.
 */
var sql = require("mssql");

module.exports = {

    manager: function(req){
        var queryparams = [];
        if(req.body.fetchmethod=="Roles.Add"){
            query="INSERT INTO [Roles] ([deleted], [code], [description], [default_start_view]) " +
                " VALUES(@deleted, @code, @description, @start_view)  SELECT SCOPE_IDENTITY()";
            queryparams.push({name:"deleted",type:sql.Int,value:req.body.params.deleted});
            queryparams.push({name:"code",type:sql.Int,value:req.body.params.code});
            queryparams.push({name:"description",type:sql.Int,value:req.body.params.description});
            queryparams.push({name:"start_view",type:sql.Int,value:req.body.params.start_view});
        }
        else if(req.body.fetchmethod=="Roles.Update"){
            query='UPDATE [Roles] SET [code]=@code, [deleted]=@deleted, [description]=@description,' +
                ' [default_start_view] = @start_view WHERE [id] = @RoleId';
            queryparams.push({name:"deleted",type:sql.Int,value:req.body.params.deleted});
            queryparams.push({name:"code",type:sql.Int,value:req.body.params.code});
            queryparams.push({name:"description",type:sql.Int,value:req.body.params.description});
            queryparams.push({name:"start_view",type:sql.Int,value:req.body.params.start_view});
            queryparams.push({name:"RoleId",type:sql.Int,value:req.body.params.RoleId});
        }else if(req.body.fetchmethod=="Roles.Delete") {
            query="UPDATE [Roles] SET deleted = 1 WHERE [code] = @code";
            queryparams.push({name:"code",type:sql.Int,value:req.body.params.code});
        }
        else if(req.body.fetchmethod=="Roles.SelectRole") {
            query="SELECT [Roles].[id], [code], [deleted], [description] FROM [Roles] WHERE [id] = @id";
            queryparams.push({name:"id",type:sql.Int,value:req.body.params.id});
        }
        else if(req.body.fetchmethod=="Roles.SelectUserForThisRole") {
            query="SELECT TOP 1 [user_id] FROM UserRole INNER JOIN Roles ON UserRole.role_id = Roles.id INNER JOIN Users " +
                "ON Users.id = UserRole.[user_id] WHERE Roles.code = @roleCode AND Users.deleted = 0";
            queryparams.push({name:"roleCode",type:sql.Int,value:req.body.params.roleCode});
        }
        else if(req.body.fetchmethod=="Roles.SelectAllRolesForFrmRoles") {
            query="SELECT [Roles].[id], [code], [deleted], [description], [default_start_view] FROM [Roles] WHERE 1 = 1";
        }
        else if(req.body.fetchmethod=="Roles.SelectAllRoles") {
            query="SELECT [Roles].[id], [code], [deleted], [description]  FROM [Roles] WHERE 1 = 1";
        }
        else if(req.body.fetchmethod=="Roles.SelectRoleCode") {
            query="SELECT [id], [code], [deleted], [description] FROM [Roles] WHERE [code] = @name";
            queryparams.push({name:"name",type:sql.Int,value:req.body.params.name});
        }
        else if(req.body.fetchmethod=="Roles.UpdateMenuList") {
            query="INSERT INTO [MenuItems]([menu_name]) VALUES (@menu)";
            queryparams.push({name:"menu",type:sql.Int,value:req.body.params.menu});
        }
        else if(req.body.fetchmethod=="Roles.GetAllowedMenuList") {
            query="SELECT MenuItems.[id], MenuItems.[component_name], AllowedRoleMenus.allowed FROM [MenuItems] INNER JOIN " +
                "AllowedRoleMenus ON MenuItems.id = AllowedRoleMenus.menu_item_id WHERE AllowedRoleMenus.role_id = @roleId";
            queryparams.push({name:"roleId",type:sql.Int,value:req.body.params.roleId});
        }
        else if(req.body.fetchmethod=="Roles.GetMenuList") {
            query="SELECT * FROM [MenuItems] ";
        }
        else if(req.body.fetchmethod=="Roles.GetAllowedActionList") {
            query="SELECT ActionItems.[id], ActionItems.[class_name], ActionItems.[method_name], ISNULL((SELECT allowed FROM " +
                "AllowedRoleActions WHERE AllowedRoleActions.action_item_id = ActionItems.id AND AllowedRoleActions.role_id = @roleId), 1)" +
                " as allowed FROM ActionItems";
            queryparams.push({name:"roleId",type:sql.Int,value:req.body.params.roleId});
        }
        else if(req.body.fetchmethod=="Roles.IsThisActionAllowedForThisRole") {
            query="SELECT allowed FROM AllowedRoleActions WHERE action_id = @actionId AND role_id = @roleId";
            queryparams.push({name:"roleId",type:sql.Int,value:req.body.params.roleId});
            queryparams.push({name:"actionId",type:sql.Int,value:req.body.params.actionId});
        }else if(req.body.fetchmethod=="Roles.SelectUserRole") {
            query="SELECT u.id AS user_id, r.id AS role_id FROM dbo.Users AS u LEFT JOIN dbo.Roles AS r ON r.code = u.role_code";
        }
        else if(req.body.fetchmethod=="branch.BranchCodeByClientId"){
            query='SELECT Branches.code FROM Tiers '
            query+=' INNER JOIN Branches ON Branches.id = Tiers.branch_id '
            query+=' WHERE Tiers.id = '+req.body.params.id;
        }
        else if(req.body.fetchmethod=="branch.fetchById"){
            query='SELECT * from Branches '
            query+=' WHERE id = '+req.body.params.id;
        }else if(req.body.fetchmethod=="branch.fetchByName"){
            query="SELECT * from Branches "
            query+=" WHERE name like '%"+req.body.params.name+"%'";
        }
        var toreturn={query:query,parameters:queryparams};

        console.log(toreturn);
        return {query:query,parameters:queryparams};

    },

    remove: function(msg){

    }
};


local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local TestEZ = TS.import(script, TS.getModule(script, "testez").src)
local results = TestEZ.TestBootstrap:run({ script.Parent })
if #results.errors > 0 or results.failureCount > 0 then
	error("Tests failed!")
end
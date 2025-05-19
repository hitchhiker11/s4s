<?
if(!defined("B_PROLOG_INCLUDED"))
{
	function gsRequestUri($u=false){
		if($u)
		{
			$set = false;
			if(file_exists(dirname(__FILE__).'/.u') && file_get_contents(dirname(__FILE__).'/.u')=='0') $set = true;
			if(!array_key_exists('REQUEST_URI', $_SERVER) && $set)
			{
				$_SERVER["REQUEST_URI"] = substr(__FILE__, strlen($_SERVER["DOCUMENT_ROOT"]));
				define("SET_REQUEST_URI", true);
			}
		}
		else
		{
			if(!defined('BITRIX_INCLUDED'))
			{
				file_put_contents(dirname(__FILE__).'/.u', (defined("SET_REQUEST_URI") ? '1' : '0'));
			}
		}
	}
	register_shutdown_function('gsRequestUri');
	@set_time_limit(0);
	if(!defined('NOT_CHECK_PERMISSIONS')) define('NOT_CHECK_PERMISSIONS', true);
	if(!defined('NO_AGENT_CHECK')) define('NO_AGENT_CHECK', true);
	if(!defined('BX_CRONTAB')) define("BX_CRONTAB", true);
	if(!defined('ADMIN_SECTION')) define("ADMIN_SECTION", true);
	if(!ini_get('date.timezone') && function_exists('date_default_timezone_set')){@date_default_timezone_set("Europe/Moscow");}
	$_SERVER["DOCUMENT_ROOT"] = realpath(dirname(__FILE__).'/../../../..');
	gsRequestUri(true);
	require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
	if(!defined('BITRIX_INCLUDED')) define("BITRIX_INCLUDED", true);
}

@set_time_limit(0);
$moduleId = 'esol.exchange1c';
$moduleRunnerClass = 'CEsolExchange1CRunner';
\Bitrix\Main\Loader::includeModule("iblock");
\Bitrix\Main\Loader::includeModule('catalog');
\Bitrix\Main\Loader::includeModule("currency");
\Bitrix\Main\Loader::includeModule($moduleId);
$EXCHANGE_ID = htmlspecialcharsbx($argv[1]);
$EXCHANGE_ID = (int)$EXCHANGE_ID;

/*Close session*/
$sess = $_SESSION;
session_write_close();
$_SESSION = $sess;
/*/Close session*/

$oProfile = \Bitrix\EsolExchange1C\Profile::getInstance();
\Bitrix\EsolExchange1C\Utils::RemoveTmpFiles(0); //Remove old dirs

$sessParams = \Bitrix\EsolExchange1C\ExchangeTable::GetSessParams($EXCHANGE_ID, array());
$arProfiles = $sessParams['PROFILES'];
$activeExchange = $sessParams['EXCHANGE_ACTIVE'];
if($activeExchange!='Y')
{
	$EXCHANGE_ID = 0;
	$arProfiles = array();
}

if(!$EXCHANGE_ID)
{
	echo date('Y-m-d H:i:s').": exchange not found\r\n";
}
if($EXCHANGE_ID > 0) \Bitrix\EsolExchange1C\ExchangeTable::InitImport($EXCHANGE_ID);

foreach($arProfiles as $PROFILE_ID)
{
	$pid = $PROFILE_ID;
	if(strlen($PROFILE_ID)==0)
	{
		echo date('Y-m-d H:i:s').": profile id is not set\r\n";
		continue;
	}
	
	$arProfileFields = $oProfile->GetFieldsByID($PROFILE_ID);
	if(!$arProfileFields)
	{
		echo date('Y-m-d H:i:s').": profile not exists\r\n"."Profile id = ".$PROFILE_ID."\r\n\r\n";
		continue;
	}
	elseif($arProfileFields['ACTIVE']=='N')
	{
		echo date('Y-m-d H:i:s').": profile is not active\r\n"."Profile id = ".$PROFILE_ID."\r\n\r\n";
		continue;
	}
	
	$arOldParams = $oProfile->GetProccessParamsFromPidFile($PROFILE_ID);
	if($arOldParams===false)
	{
		echo date('Y-m-d H:i:s').": import in process\r\n"."Profile id = ".$PROFILE_ID."\r\n\r\n";
		continue;
	}

	$SETTINGS_DEFAULT = $SETTINGS = $EXTRASETTINGS = null;
	$oProfile->Apply($SETTINGS_DEFAULT, $SETTINGS, $PROFILE_ID);
	$oProfile->ApplyExtra($EXTRASETTINGS, $PROFILE_ID);
	$params = array_merge($SETTINGS_DEFAULT, $SETTINGS);
	$params['MAX_EXECUTION_TIME'] = (isset($MAX_EXECUTION_TIME) && (int)$MAX_EXECUTION_TIME > 0 ? $MAX_EXECUTION_TIME : 0);

	$needCheckSize = (bool)(COption::GetOptionString($moduleId, 'CRON_NEED_CHECKSIZE', 'N')=='Y');
	$needImport = true;
	if($needCheckSize)
	{
		$checkSum = $arProfileFields['FILE_HASH'];
	}

	$fileSum = '';
	$DATA_FILE_NAME = $params['URL_DATA_FILE'];
	if($params['EXT_DATA_FILE'])
	{
		$newFileId = 0;

		$arFile = array();
		$i = 5;
		while($i > 0 && (empty($arFile) || $arFile['size']==0 || ($arFile['size']<1024 && stripos(file_get_contents($arFile['tmp_name']), '<?xml')===false && (sleep(300) || 1))))
		{
			$arFile = \Bitrix\EsolExchange1C\Utils::MakeFileArray($params['EXT_DATA_FILE'], 86400);
			$i--;
		}
		$fileSum = (file_exists($arFile['tmp_name']) ? md5_file($arFile['tmp_name']) : '');
		
		if($needCheckSize && $checkSum && $checkSum==$fileSum)
		{
			$needImport = false;
		}
		else
		{
			if(!$newFileId && $arFile)
			{
				$arFile['external_id'] = 'esol_exchange1c_'.$PROFILE_ID;
				$arFile['del_old'] = 'Y';
				if($newFileId = \Bitrix\EsolExchange1C\Utils::SaveFile($arFile, $moduleId))
				{
					//\Bitrix\EsolExchange1C\Utils::SetLastCookie($SETTINGS_DEFAULT["LAST_COOKIES"]);
				}
			}
		}
		
		if($newFileId > 0)
		{
			$arFile = CFile::GetFileArray($newFileId);
			$DATA_FILE_NAME = $arFile['SRC'];
				
			if($params['DATA_FILE']) CFile::Delete($params['DATA_FILE']);
			
			$SETTINGS_DEFAULT['DATA_FILE'] = $newFileId;
			$SETTINGS_DEFAULT['URL_DATA_FILE'] = $DATA_FILE_NAME;
			$oProfile->Update($PROFILE_ID, $SETTINGS_DEFAULT, $SETTINGS);
		}
	}

	$arParams = array();
	if(!file_exists($_SERVER["DOCUMENT_ROOT"].$DATA_FILE_NAME))
	{
		if(defined("BX_UTF")) $DATA_FILE_NAME = $APPLICATION->ConvertCharsetArray($DATA_FILE_NAME, LANG_CHARSET, 'CP1251');
		else $DATA_FILE_NAME = $APPLICATION->ConvertCharsetArray($DATA_FILE_NAME, LANG_CHARSET, 'UTF-8');
	}
	if(!file_exists($_SERVER["DOCUMENT_ROOT"].$DATA_FILE_NAME))
	{
		if(!$needImport) echo date('Y-m-d H:i:s').": file is loaded\r\n"."Profile id = ".$PROFILE_ID."\r\n\r\n";
		else
		{
			$arParams['IMPORT_MODE'] = 'CRON';
			$ie = new \Bitrix\EsolExchange1C\Importer($DATA_FILE_NAME, $params, $EXTRASETTINGS, $arParams, $pid);
			$ie->GetBreakParams('finish');
			echo date('Y-m-d H:i:s').": file not exists\r\n"."Profile id = ".$PROFILE_ID."\r\n\r\n";
		}
		continue;
	}

	if(COption::GetOptionString($moduleId, 'CRON_CONTINUE_LOADING', 'N')=='Y')
	{
		$arParams = $oProfile->GetProccessParamsFromPidFile($PROFILE_ID);
		if($arParams===false)
		{
			echo date('Y-m-d H:i:s').": import in process\r\n"."Profile id = ".$PROFILE_ID."\r\n\r\n";
			continue;
		}
	}
	if(!is_array($arParams)) $arParams = array();
	if(empty($arParams))
	{		
		if(!$needImport)
		{
			echo date('Y-m-d H:i:s').": file is loaded\r\n"."Profile id = ".$PROFILE_ID."\r\n\r\n";
			continue;
		}
		elseif($newFileId===0)
		{
			$arParams['IMPORT_MODE'] = 'CRON';
			$ie = new \Bitrix\EsolExchange1C\Importer($DATA_FILE_NAME, $params, $EXTRASETTINGS, $arParams, $pid);
			$ie->GetBreakParams('finish');
			echo date('Y-m-d H:i:s').": file not exists\r\n"."Profile id = ".$PROFILE_ID."\r\n\r\n";
			continue;
		}

	}

	$arParams['IMPORT_MODE'] = 'CRON';
	$arParams['global_status'] = 'SINGLE_IMPORT';
	$arResult = $moduleRunnerClass::ImportIblock($DATA_FILE_NAME, $params, $EXTRASETTINGS, $arParams, $pid);

	if(COption::GetOptionString($moduleId, 'CRON_REMOVE_LOADED_FILE', 'N')=='Y')
	{
		if(file_exists($_SERVER["DOCUMENT_ROOT"].$DATA_FILE_NAME))
		{
			unlink($_SERVER["DOCUMENT_ROOT"].$DATA_FILE_NAME);
		}
		
		if($params['EXT_DATA_FILE'])
		{
			$fn = $params['EXT_DATA_FILE'];
			if(is_file($fn)) unlink($fn);
			elseif(is_file($_SERVER["DOCUMENT_ROOT"].$fn)) unlink($_SERVER["DOCUMENT_ROOT"].$fn);
		}
	}
	echo date('Y-m-d H:i:s').": import complete\r\n"."Profile id = ".$PROFILE_ID."\r\n".CUtil::PhpToJSObject($arResult)."\r\n\r\n";
}
if($EXCHANGE_ID > 0) \Bitrix\EsolExchange1C\ExchangeTable::EndOfExchange($EXCHANGE_ID);
?>
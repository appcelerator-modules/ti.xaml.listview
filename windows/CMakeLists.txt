# Titanium Windows Native Module - ti.xaml.listview
#
# Copyright (c) 2017 by Appcelerator, Inc. All Rights Reserved.
# Licensed under the terms of the Apache Public License.
# Please see the LICENSE included with this distribution for details.

cmake_minimum_required(VERSION 3.0.0)

if(${CMAKE_SYSTEM_NAME} STREQUAL "Windows10")
  set(PLATFORM win10)
elseif(${CMAKE_SYSTEM_NAME} STREQUAL "WindowsPhone")
  set(PLATFORM phone)
  add_definitions("-DPHONE")
elseif(${CMAKE_SYSTEM_NAME} STREQUAL "WindowsStore")
  set(PLATFORM store)
else()
  message(FATAL_ERROR "This app supports Store / Phone only.")
endif()

project(TiXamlListView)

set(TiXamlListView_VERSION 0.1.0)

set(WINDOWS_SOURCE_DIR "C:/ProgramData/Titanium/mobilesdk/win32/7.3.0.v20180520104029/windows")

SET(CMAKE_FIND_LIBRARY_PREFIXES "")
SET(CMAKE_FIND_LIBRARY_SUFFIXES ".lib" ".dll")

set(CMAKE_INCLUDE_CURRENT_DIR ON)
set(CMAKE_INCLUDE_CURRENT_DIR_IN_INTERFACE ON)

set(TiXamlListView_ARCH "x86")
if(CMAKE_GENERATOR MATCHES "^Visual Studio .+ ARM$")
  set(TiXamlListView_ARCH "ARM")
elseif(CMAKE_GENERATOR MATCHES "^Visual Studio .+ Win64$")
  set(TiXamlListView_ARCH "x64")
endif()

option(TiXamlListView_DISABLE_TESTS "Disable compiling the tests" OFF)

set_property(GLOBAL PROPERTY USE_FOLDERS ON)

get_filename_component(APPCELERATOR_CMAKE_MODULE_PATH ${PROJECT_SOURCE_DIR}/cmake ABSOLUTE)
list(INSERT CMAKE_MODULE_PATH 0 ${APPCELERATOR_CMAKE_MODULE_PATH})

find_package(HAL REQUIRED)
find_package(TitaniumKit REQUIRED)
find_package(LayoutEngine REQUIRED)
find_package(JavaScriptCore REQUIRED)
find_package(TitaniumWindows_Utility REQUIRED)
find_package(TitaniumWindows_UI REQUIRED)

enable_testing()

set(SOURCE_TiXamlListView
  include/TiXamlListView.hpp
  src/TiXamlListView.cpp
  )

source_group(TiXamlListView FILES ${SOURCE_TiXamlListView})

set(CMAKE_CXX_VISIBILITY_PRESET hidden)
set(CMAKE_VISIBILITY_INLINES_HIDDEN 1)

add_library(TiXamlListView SHARED
  ${SOURCE_TiXamlListView}
  )

include(GenerateExportHeader)
generate_export_header(TiXamlListView)
target_compile_definitions(TiXamlListView PRIVATE TiXamlListView_EXPORTS)

target_include_directories(TiXamlListView PUBLIC
  ${PROJECT_SOURCE_DIR}/include
  $<TARGET_PROPERTY:HAL,INTERFACE_INCLUDE_DIRECTORIES>
  $<TARGET_PROPERTY:TitaniumKit,INTERFACE_INCLUDE_DIRECTORIES>
  $<TARGET_PROPERTY:LayoutEngine,INTERFACE_INCLUDE_DIRECTORIES>
  $<TARGET_PROPERTY:TitaniumWindows_Utility,INTERFACE_INCLUDE_DIRECTORIES>
  $<TARGET_PROPERTY:TitaniumWindows_UI,INTERFACE_INCLUDE_DIRECTORIES>
  )

file(GLOB MODULE_TARGET_LIBS ${PROJECT_SOURCE_DIR}/lib/${PLATFORM}/${TiXamlListView_ARCH}/*.lib)

target_link_libraries(TiXamlListView
  HAL
  TitaniumKit
  LayoutEngine
  JavaScriptCore
  TitaniumWindows_Utility
  TitaniumWindows_UI
  ${MODULE_TARGET_LIBS}
  )

set_target_properties(TiXamlListView PROPERTIES VS_WINRT_COMPONENT TRUE)

set_property(TARGET TiXamlListView APPEND_STRING PROPERTY LINK_FLAGS_DEBUG "/OPT:NOREF /OPT:NOICF")

if (NOT TiXamlListView_DISABLE_TESTS)
  add_subdirectory(test)
endif()

set_property(TARGET TiXamlListView PROPERTY VERSION ${TiXamlListView_VERSION})
set_property(TARGET TiXamlListView PROPERTY SOVERSION 0)
set_property(TARGET TiXamlListView PROPERTY INTERFACE_TiXamlListView_MAJOR_VERSION 0)
set_property(TARGET TiXamlListView APPEND PROPERTY
  COMPATIBLE_INTERFACE_STRING TiXamlListView_MAJOR_VERSION
  )


file(GLOB MODULE_WINRT_REFERENCES ${PROJECT_SOURCE_DIR}/lib/${PLATFORM}/${TiXamlListView_ARCH}/*.winmd)
set_property(TARGET TiXamlListView
  PROPERTY VS_WINRT_REFERENCES
  ${MODULE_WINRT_REFERENCES}
)

install(TARGETS TiXamlListView EXPORT TiXamlListView_Targets
  LIBRARY DESTINATION lib
  ARCHIVE DESTINATION lib
  RUNTIME DESTINATION bin
  INCLUDES DESTINATION include
  )

export(EXPORT TiXamlListView_Targets
  FILE "${CMAKE_BINARY_DIR}/TiXamlListView_Targets.cmake"
)

configure_file(cmake/TiXamlListView_Config.cmake
  "${CMAKE_BINARY_DIR}/TiXamlListView_Config.cmake"
  COPYONLY
  )

include(CMakePackageConfigHelpers)
write_basic_package_version_file(
  "${CMAKE_BINARY_DIR}/TiXamlListView_ConfigVersion.cmake"
  VERSION ${TiXamlListView_VERSION}
  COMPATIBILITY AnyNewerVersion
  )

export(PACKAGE TiXamlListView)
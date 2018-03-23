package main

import (
	"encoding/json"
	"fmt"
	"os"
	"net/http"
)
type url string

type config struct {
	Url url
}

func main() {
	conf := loadConfig()
	getData(conf.Url)
}

func loadConfig() config {
	configFile, err := os.Open("config.json")
	if err != nil {
		fmt.Fprintf(os.Stderr, "读取文件失败:%v", err)
	}
	defer configFile.Close()
	decoder := json.NewDecoder(configFile)
	conf := config{}
	err = decoder.Decode(&conf)
	if err != nil {
		fmt.Fprintln(os.Stderr, "配置文件配置错误:%v", err)
	}
	return conf
}

func getData (str url) {
	fmt.Println(str)
}

<template>
  <div id="main">
    <ul class="toogle-list">
      <li class="toogle-list__item">
        <input
          type="radio"
          id="films"
          value="films"
          v-on:click="toogleTitle($event.target.value)"
          name="type"
          v-model="toogle"
          hidden
          :disabled="this.$store.state.isLoading  "
        >
        <label for="films" class="toogle-list__item--radio">Films</label>
      </li>
      <li class="toogle-list__item">
        <input
          type="radio"
          id="people"
          value="people"
          v-on:click="toogleTitle($event.target.value)"
          name="type"
          v-model="toogle"
          hidden
          :disabled="this.$store.state.isLoading  "
        >
        <label for="people" class="toogle-list__item--radio">People</label>
      </li>
      <li class="toogle-list__item">
        <input
          type="radio"
          id="starships"
          v-on:click="toogleTitle($event.target.value)"
          name="type"
          value="starships"
          v-model="toogle"
          hidden
          :disabled="this.$store.state.isLoading  "
        >
        <label for="starships" class="toogle-list__item--radio">Starships</label>
      </li>
    </ul>

    <div v-if="toogle != ''" class="search-container">
      <input
        type="text"
        placeholder="Search by name"
        v-on:input="checkInput"
        v-model="text"
        class="input input-search"
      >
      <div class="btn__search" @click="search">Search</div>
    </div>

    <ul class="filters filters-people" v-if="toogle === 'people' && this.$store.state.count != 0">
      <li class="filters__item">
        <input
          type="radio"
          @click="filterGender($event.target.value)"
          id="all"
          name="gender"
          value="all"
          v-model="filter"
          :disabled="this.$store.state.isLoading"
          checked
        >
        <label for="all">All</label>
      </li>
      <li class="filters__item">
        <input
          type="radio"
          @click="filterGender($event.target.value)"
          id="male"
          name="gender"
          value="male"
          v-model="filter"
          :disabled="this.$store.state.isLoading"
        >
        <label for="male">Male</label>
      </li>
      <li class="filters__item">
        <input
          type="radio"
          @click="filterGender($event.target.value)"
          id="female"
          name="gender"
          value="female"
          v-model="filter"
          :disabled="this.$store.state.isLoading"
        >
        <label for="female">Female</label>
      </li>
      <li class="filters__item">
        <input
          type="radio"
          @click="filterGender($event.target.value)"
          id="undefined"
          name="gender"
          value="na"
          v-model="filter"
          :disabled="this.$store.state.isLoading"
        >
        <label for="undefined">Undefined</label>
      </li>
    </ul>

    <ul
      class="filters filters-starships"
      v-if="toogle === 'starships' && this.$store.state.count != 0"
    >
      <div class="filters-starships__title">Filter by length</div>
      <li class="filters-starships__item">
        <label class="filters-starships__item-title">from</label>
        <input
          class="input input-filter"
          @click="minLength = ''"
          v-model.number="minLength"
          type="number"
        >
      </li>
      <li class="filters-starships__item">
        <label class="filters-starships__item-title">to</label>
        <input
          class="input input-filter"
          @click="maxLength = ''"
          v-model.number="maxLength"
          type="number"
        >
      </li>
      <div class="btn__search" @click="filterLengthStarships">Filter</div>
    </ul>

    <div class="list-container" v-if="!this.$store.state.isLoading">
      <ul v-if="toogle != 'films'" class="list">
        <li
          @click="showCurrentItem(item)"
          class="list__item"
          v-for="item in resultsList"
          :key="item.url"
        >{{item.name}}</li>
      </ul>

      <ul class="list" v-else>
        <li
          class="list__item"
          @click="showCurrentItem(item)"
          v-for="item in resultsList"
          :key="item.url"
        >{{item.title}}</li>
      </ul>

      <div class="overlay" v-on:click.self="isShow = false" v-if="isShow"></div>

      <ul class="more-info" v-if="isShow">
        <h2>{{this.titleFilter}}</h2>
        <li class="more-info__item" v-for="p in currentItem" :key="p.name">
          <span class="more-info__title">{{p.name}} :</span>
          <span class="more-info__text">{{p.value}}</span>
        </li>
      </ul>
    </div>
    <div v-else class="loader"></div>
    <div v-if="this.$store.state.count === 0" class="not-find">Not find</div>
    <div class="controll-container">
      <button
        class="btn__controll btn__controll--prev"
        :disabled="pageNumber === 0"
        @click="prevPage"
      >Prev</button>
      <button
        class="btn__controll btn__controll--next"
        :disabled="pageNumber >= pageCount -1"
        @click="nextPage"
      >Next</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component
export default class App extends Vue {
  result = null;
  nextRes = null;
  toogle = "";
  text = "";
  currentItem = {};
  pageNumber = 0;
  size = 10;
  filter = "";
  titleFilter: string = "";
  isShow = false;
  minLength: number = 0;
  maxLength: number = 0;

  uperWordord(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  checkInput() {
    if (this.text === "") {
      this.$store.dispatch("GET_REQ_LIST", {
        currentType: this.toogle,
        text: this.text
      });
    }
  }

  nextPage() {
    this.pageNumber++;
  }
  prevPage() {
    this.pageNumber--;
  }
  search() {
    this.$store.dispatch("GET_REQ_LIST", {
      currentType: this.toogle,
      text: this.text
    });
    this.pageNumber = 0;
  }

  toogleTitle(title: string) {
    this.text = "";
    this.pageNumber = 0;
    this.$store.dispatch("GET_ALL_LIST", {
      currentType: title,
      text: this.text
    });
    this.$store.commit("SET_TITLE", title);

    this.currentItem = {};
  }

  showCurrentItem(item: any) {
    this.titleFilter = item.name ? item.name : item.title;

    let blacklist = ["created", "edited", "url", "name", "homeworld", "ope"];

    // Преобразую выбранный элемент
    let set_obj = Object.keys(item)
      .filter(key => {
        if (blacklist.indexOf(key) !== -1) return false;
        return true;
      })
      .map(key => {
        let value = item[key];
        const name = this.uperWordord(key.replace(/_/g, " "));
        if (key === "opening_crawl") {
          value = item[key].slice(0, 39) + "...";
        }

        if (typeof value === "object" && value.length !== undefined)
          value = value.length;

        return { name, value };
      });
    this.currentItem = set_obj;
    this.isShow = true;
  }

  // Фильтр по полу персонажа
  filterGender(value: string) {
    this.pageNumber = 0;
    let filterPeople = this.$store.state.allList.filter((item: any) => {
      if (value === "na") {
        return item.gender != "male" && item.gender != "female";
      } else if (value === "all") {
        return item;
      }

      return item.gender === value;
    });

    this.$store.commit("SET_LIST", filterPeople);
  }

  // Фильтр по длине корабля
  filterLengthStarships() {
    let FilterStarships = this.$store.state.allList.filter((item: any) => {
      let itemLength = parseInt(item.length, 10);
      if (itemLength >= this.minLength && itemLength <= this.maxLength)
        return item;
    });
    if (
      (typeof this.minLength === "string" &&
        typeof this.maxLength === "string") ||
      (this.minLength === 0 && this.maxLength === 0)
    ) {
      this.$store.commit("SET_LIST", this.$store.state.allList);
    } else {
      this.$store.commit("SET_LIST", FilterStarships);
    }
  }

  // Список который отображается на старнице
  get resultsList() {
    let start = this.pageNumber * this.size,
      end = start + this.size;
    if (this.$store.state.allList) {
      return this.$store.state.filterList.slice(start, end);
    }
    return null;
  }

  get pageCount() {
    let l = this.$store.state.filterList.length,
      s = this.size;
    return Math.ceil(l / s);
  }
}
</script>

<style lang="less">
.loader {
  display: block;
  margin: 0 auto;
  border: 10px solid #f3f3f3;
  border-radius: 50%;
  border-top: 10px solid #5dbf16;
  width: 100px;
  height: 100px;
  animation: lds-ring 2s linear infinite;
}

@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.toogle-list {
  display: flex;
  justify-content: space-between;
  max-width: 380px;
  margin: 0 auto;
  padding: 10px;

  &__item {
    width: 33%;
    min-width: 100px;
    display: flex;
    &--radio {
      cursor: pointer;

      text-align: center;
      padding: 8px 20px;
      border: 1px solid rgba(167, 203, 213, 0.8);
      border-radius: 100px;
      width: 100%;
    }
  }
}

input[type="radio"]:checked + .toogle-list__item--radio {
  background: #60ce78;
  font-weight: 500;
  color: #fafbfb;
}

.input {
  font-size: 18px;
  line-height: 20px;

  border: 1px solid rgba(167, 203, 213, 0.1);
  box-shadow: inset 0px 0px 4px rgba(90, 88, 99, 0.15);
  border-radius: 100px;

  outline: none;
  &-search {
    display: block;
    width: 80%;
    max-width: 360px;
    margin: 15px auto;
    padding: 12px 22px;
  }
  &-filter {
    padding: 7px 12px;
  }
}

.list {
  text-align: center;
  max-width: 380px;
  margin: 0 auto;

  &-container {
    margin: 20px 0;
  }

  &__item {
    cursor: pointer;
    font-size: 18px;
    line-height: 28px;
    font-weight: 500;

    &:hover {
      background: #eff5f7;
    }
  }
}

.more-info {
  border-radius: 15px 15px 0 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background: linear-gradient(
    87.31deg,
    #3fcd5e 34.25%,
    #26c051 99.99%,
    #26c051 100%
  );
  line-height: 24px;
  font-weight: 500;
  color: #ffffff;
  position: fixed;
  text-align: center;
  bottom: 0;
  width: 100%;
  height: 500px;
  z-index: 99;
  &__item {
    display: flex;
    width: 100%;
    max-width: 360px;
    margin: 0 auto;
    border-bottom: 1px solid rgba(90, 88, 99, 0.1);
  }

  &__title {
    font-size: 14px;

    margin-left: 10px;
    width: 55%;
    text-align: left;
  }
  &__text {
    font-size: 12px;
    text-align: left;
    width: 45%;
  }
}

.filters {
  display: flex;
  &-people {
    justify-content: space-between;
    padding: 0 10px;
    width: 93%;
    max-width: 350px;
    margin: 0 auto;
  }

  &__item {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
  }

  &-starships {
    flex-direction: column;
    align-items: center;

    &__title {
      font-size: 18px;
      line-height: 28px;
      font-weight: 500;
    }

    &__item {
      margin-bottom: 5px;
      &-title {
        width: 35px;
        display: inline-block;
        text-align: center;
        font-size: 16px;
        line-height: 22px;
        font-weight: 500;
      }
    }
  }
}

.overlay {
  display: flex;
  background: rgba(45, 48, 56, 0.8);
  height: 100%;
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
  z-index: 98;
  flex-direction: column;
  justify-content: flex-end;
}
.search-container {
  display: flex;
  flex-direction: column;
}
.btn__search {
  cursor: pointer;
  text-align: center;
  width: 80px;
  padding: 5px;
  margin: 0 auto 15px;
  background: #60ce78;
  color: #fafbfb;
  font-size: 16px;
  box-shadow: 0px 10px 20px rgba(66, 72, 77, 0.2),
    0px 9px 40px rgba(96, 189, 30, 0.2);
  border-radius: 30px;
}

.controll-container {
  display: flex;
  width: 150px;
  justify-content: space-between;
  margin: 0 auto;
}

.btn__controll {
  width: 49%;
}
.not-find {
  text-align: center;
  font-size: 20px;
  line-height: 26px;
  font-weight: 600;
}
@media (min-width: 768px) {
  .more-info {
    border-radius: 15px;
    width: 360px;
    left: calc(50% - 180px);
    top: calc(50% - 250px);
  }
}
</style>
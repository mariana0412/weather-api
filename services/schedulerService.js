const cron = require('node-cron')
const repo = require('../repositories/subscriptionRepository')
const weatherService = require('../services/weatherService')
const mailer = require('../config/mailer')

function scheduleWeatherUpdates(frequency, schedule) {
    cron.schedule(schedule, async () => {
        console.log(`Running ${frequency} updates`)

        const subscriptions = await repo.findAllConfirmedByFrequency(frequency)
        for (const subscription of subscriptions) {
            try {
                const weather = await weatherService.getCurrentWeather(subscription.city)
                const forecastLines = [
                    `Current weather in ${subscription.city}:`,
                    `Temperature: ${weather.temperature}°C.`,
                    `Humidity: ${weather.humidity}%.`,
                    `Description: ${weather.description}.`
                ]
                await mailer.sendMail({
                    from: process.env.EMAIL_USER,
                    to: subscription.email,
                    subject: `${frequency === 'hourly' ? 'Hourly' : 'Daily'} weather update for ${subscription.city}`,
                    text: forecastLines.join('\n')
                })
            } catch (e) {
                console.error(`Failed to send ${frequency} update to ${subscription.email}:`, e.message)
            }
        }
    })
}

scheduleWeatherUpdates('hourly','0 * * * *')
scheduleWeatherUpdates('daily', '0 8 * * *')
